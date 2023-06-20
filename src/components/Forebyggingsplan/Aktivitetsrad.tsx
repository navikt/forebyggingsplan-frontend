import { Aktivitet, AktivitetStatus } from "../../types/Aktivitet";
import { Accordion, Heading } from "@navikt/ds-react";
import styles from "./Aktivitetsrad.module.css";
import {
    FetchingError,
    fullførAktivitet,
    velgAktivitet,
} from "../../lib/forebyggingsplan-klient";
import { useHentOrgnummer } from "../Layout/Banner/Banner";
import {
    loggFullførAktivitet,
    loggVelgAktivitet,
    loggÅpneAktivitet,
} from "../../lib/amplitude-klient";
import { useEffect, useState } from "react";
import { AktivitetHeader } from "./AktivitetHeader";
import { useRouter } from "next/router";
import {
    lagreIaMetrikkInformasjonstjeneste,
    lagreIaMetrikkInteraksjonstjeneste,
} from "../../lib/ia-metrikker-klient";
import { Aktivitetsmal } from "./Aktivitetsmal/Aktivitetsmal";

interface Props {
    aktivitet: Aktivitet;
    åpen?: boolean;
    onClick?: () => void;
    onClose?: () => void;
    oppdaterValgteAktiviteter: () => void;
}

export const Aktivitetsrad = ({
    aktivitet,
    åpen = false,
    onClick,
    oppdaterValgteAktiviteter,
    onClose,
}: Props) => {
    const router = useRouter();
    const [varForrigeStateÅpen, setVarForrigeStateÅpen] =
        useState<boolean>(åpen);
    const [serverFeil, setServerfeil] = useState<string>("");
    const { orgnr } = useHentOrgnummer();

    useEffect(() => {
        if (!åpen) {
            if (varForrigeStateÅpen) {
                onClose?.();
            }
            setVarForrigeStateÅpen(false);
        }
    }, [åpen, aktivitet.aktivitetsmalId, onClose, varForrigeStateÅpen]);

    useEffect(() => {
        if (åpen) {
            if (!varForrigeStateÅpen) {
                loggÅpneAktivitet(aktivitet);
                lagreIaMetrikkInformasjonstjeneste(orgnr);
            }
            setVarForrigeStateÅpen(true);
        }
    }, [åpen, varForrigeStateÅpen, aktivitet, orgnr]);

    const velgAktivitetHandler = (frist?: Date): Promise<void> | undefined => {
        setServerfeil("");
        loggVelgAktivitet(aktivitet);

        return velgAktivitet({
            aktivitetsmalId: aktivitet.aktivitetsmalId,
            frist,
            orgnr: orgnr ?? undefined,
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

    const fullførAktivitetHandler = () => {
        setServerfeil("");
        loggFullførAktivitet(aktivitet);

        fullførAktivitet({
            aktivitetsmalId: aktivitet.aktivitetsmalId,
            aktivitetsId: aktivitet.aktivitetsId,
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
        <Accordion.Item open={åpen} className={styles.accordionItem}>
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
                    velgAktivitet={velgAktivitetHandler}
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
