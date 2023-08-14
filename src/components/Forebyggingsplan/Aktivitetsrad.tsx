import { Aktivitet, AktivitetStatus } from "../../types/Aktivitet";
import { Accordion, Heading } from "@navikt/ds-react";
import styles from "./Aktivitetsrad.module.css";
import {
    FetchingError,
    fullførAktivitet,
} from "../../lib/forebyggingsplan-klient";
import { useHentOrgnummer } from "../Layout/Banner/Banner";
import {
    loggFullførAktivitet,
    loggÅpneAktivitet,
} from "../../lib/amplitude-klient";
import { useCallback, useRef, useState } from "react";
import { AktivitetHeader } from "./AktivitetHeader";
import { useRouter } from "next/router";
import {
    lagreIaMetrikkInformasjonstjeneste,
    lagreIaMetrikkInteraksjonstjeneste,
} from "../../lib/ia-metrikker-klient";
import { Aktivitetsmal } from "./Aktivitetsmal/Aktivitetsmal";

interface Props {
    aktivitet: Aktivitet;
    oppdaterValgteAktiviteter: () => void;
}

export const Aktivitetsrad = ({
    aktivitet,
    oppdaterValgteAktiviteter,
}: Props) => {
    const radRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [åpen, setÅpen] = useState<boolean>(false);
    const [serverFeil, setServerfeil] = useState<string>("");
    const { orgnr } = useHentOrgnummer();

    const onClick = useCallback(() => {
        if (åpen) {
            setÅpen(false);
        } else {
            setÅpen(true);

            loggÅpneAktivitet(aktivitet);
            lagreIaMetrikkInformasjonstjeneste(orgnr);

            radRef?.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [åpen, aktivitet, orgnr, radRef]);

    const fullførAktivitetHandler = () => {
        setServerfeil("");
        loggFullførAktivitet(aktivitet);

        fullførAktivitet({
            aktivitetsmalId: aktivitet.aktivitetsmalId,
            aktivitetsmalVersjon: aktivitet.aktivitetsmalVersjon,
            orgnr: aktivitet.orgnr ?? orgnr ?? undefined,
        })
            ?.then(() => {
                oppdaterValgteAktiviteter();
                lagreIaMetrikkInteraksjonstjeneste(orgnr);
            })
            .catch((e: FetchingError) => {
                if (e.status == 503) {
                    router.push("/500").then();
                }
                setServerfeil(e.message);
            });
    };

    return (
        <Accordion.Item
            open={åpen}
            className={styles.accordionItem}
            ref={radRef}
        >
            <Accordion.Header
                onClick={onClick}
                className={`${AktivitetStatusStyle[aktivitet.status]} ${
                    styles.accordionHeader
                }`}
            >
                <Heading
                    size="medium"
                    level="3"
                    className={`${styles.sticky} ${styles.heading}`}
                >
                    <AktivitetHeader aktivitet={aktivitet} />
                </Heading>
            </Accordion.Header>
            <Accordion.Content
                data-aktivitetsmalid={aktivitet.aktivitetsmalId}
                className={styles.content}
            >
                <Aktivitetsmal
                    aktivitet={aktivitet}
                    fullførAktivitet={fullførAktivitetHandler}
                    serverFeil={serverFeil}
                />
            </Accordion.Content>
        </Accordion.Item>
    );
};

const AktivitetStatusStyle: { [key in AktivitetStatus]: string } = {
    IKKE_VALGT: styles.aktivitetIkkeValgt,
    VALGT: styles.aktivitetValgt,
    FULLFØRT: styles.aktivitetFullført,
};
