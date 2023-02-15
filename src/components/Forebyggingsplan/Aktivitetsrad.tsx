import { Aktivitet, AktivitetStatus } from "../../types/Aktivitet";
import { Accordion, Heading } from "@navikt/ds-react";
import styles from "./Aktivitetsrad.module.css";
import dynamic from "next/dynamic";
import {
    endreFrist,
    FetchingError,
    fullførAktivitet,
    velgAktivitet,
} from "../../lib/forebyggingsplan-klient";
import { useHentOrgnummer } from "../Layout/Banner/Banner";
import {
    loggEndreFrist,
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

const Aktivitetsmal = dynamic(() =>
    import("./Aktivitetsmal/Aktivitetsmal").then((mod) => mod.Aktivitetsmal)
);

interface Props {
    aktivitet: Aktivitet;
    åpen?: boolean;
    onClick?: () => void;
    onClose?: () => void;
    oppdaterValgteAktiviteter: () => void;
}

const settVideoPåPause = (frame: HTMLIFrameElement) =>
    frame.contentWindow?.postMessage(
        {
            method: "pause",
        },
        "*"
    );

const pauseAlleVideoer = (aktivitetsmalid: string) => {
    document
        .querySelectorAll<HTMLIFrameElement>(
            `[data-aktivitetsmalid='${aktivitetsmalid}'] iframe`
        )
        .forEach(settVideoPåPause);
};

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
            pauseAlleVideoer(aktivitet.aktivitetsmalId);
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

    const endreFristHandler = (frist?: Date): Promise<void> | undefined => {
        setServerfeil("");
        if (!aktivitet.aktivitetsId) return;

        loggEndreFrist(aktivitet);

        return endreFrist({
            aktivitetsId: aktivitet.aktivitetsId,
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
            <Heading
                size="medium"
                level="3"
                className={`${styles.sticky} ${styles.heading}`}
            >
                <Accordion.Header
                    onClick={onClick}
                    className={`${AktivitetStatusStyle[aktivitet.status]} ${
                        styles.accordionHeader
                    }`}
                >
                    <AktivitetHeader aktivitet={aktivitet} />
                </Accordion.Header>
            </Heading>
            <Accordion.Content
                data-aktivitetsmalid={aktivitet.aktivitetsmalId}
                className={styles.content}
            >
                <Aktivitetsmal
                    aktivitet={aktivitet}
                    velgAktivitet={velgAktivitetHandler}
                    fullførAktivitet={fullførAktivitetHandler}
                    serverFeil={serverFeil}
                    endreFristHandler={endreFristHandler}
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
