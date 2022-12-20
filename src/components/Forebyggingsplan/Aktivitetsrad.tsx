import { Aktivitet, AktivitetStatus } from "../../types/Aktivitet";
import { Accordion, Heading, Link } from "@navikt/ds-react";
import { Link as LinkIkon } from "@navikt/ds-icons";
import styles from "./Aktivitetsrad.module.css";
import dynamic from "next/dynamic";
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
} from "../../lib/amplitude";
import { CSSProperties, useEffect, useState } from "react";
import { AktivitetHeader } from "./AktivitetHeader";
import { useRouter } from "next/router";

const Aktivitetsmal = dynamic(() =>
    import("./Aktivitetsmal").then((mod) => mod.Aktivitetsmal)
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
            loggÅpneAktivitet(aktivitet);
            setVarForrigeStateÅpen(true);
        }
    }, [åpen, aktivitet]);
    const velgAktivitetHandler = (frist?: Date) => {
        setServerfeil("");
        loggVelgAktivitet(aktivitet);
        velgAktivitet({
            aktivitetsmalId: aktivitet.aktivitetsmalId,
            frist,
            orgnr: orgnr ?? undefined,
        })
            ?.then(oppdaterValgteAktiviteter)
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
            ?.then(oppdaterValgteAktiviteter)
            .catch((e: FetchingError) => {
                if (e.status == 503) {
                    router.push("/500").then();
                }
                setServerfeil(e.message);
            });
    };
    const linkIconFontSize = "1rem";
    const linkIconFontSizeCSSVariable = {
        "--link-icon-font-size": linkIconFontSize,
    } as CSSProperties;

    return (
        <Accordion.Item open={åpen} className={styles.accordionItem}>
            <Heading
                size="medium"
                level="3"
                className={`${styles.sticky} ${styles.heading}`}
                id={aktivitet.tittel.replaceAll(" ", "-").toLowerCase()}
                style={linkIconFontSizeCSSVariable}
            >
                <Link
                    className={styles.lenkeTilKort}
                    href={
                        "#" +
                        aktivitet.tittel.replaceAll(" ", "-").toLowerCase()
                    }
                >
                    <LinkIkon aria-hidden={true} fontSize={linkIconFontSize} />
                    <span className="navds-sr-only">{aktivitet.tittel}</span>
                </Link>
                <Accordion.Header
                    onClick={onClick}
                    className={`
                        ${AktivitetStatusStyle[aktivitet.status]} 
                        ${styles.accordionHeader}`}
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
