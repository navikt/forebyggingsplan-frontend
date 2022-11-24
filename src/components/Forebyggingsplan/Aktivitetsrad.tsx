import { Aktivitet, AktivitetStatus } from "../../types/Aktivitet";
import { Accordion, Tag } from "@navikt/ds-react";
import styles from "./Aktivitetsrad.module.css";
import dynamic from "next/dynamic";
import {
    fullførAktivitet,
    velgAktivitet,
} from "../../lib/forebyggingsplan-klient";
import { useHentOrgnummer } from "../Layout/Banner/Banner";
import { loggFullførAktivitet, loggVelgAktivitet } from "../../lib/amplitude";
import { useEffect } from "react";

const Aktivitetsmal = dynamic(() =>
    import("./Aktivitetsmal").then((mod) => mod.Aktivitetsmal)
);

interface Props {
    aktivitet: Aktivitet;
    åpen?: boolean;
    onClick?: () => void;
    oppdaterValgteAktiviteter: () => void;
}

const settVideoPåPause = (frame: HTMLIFrameElement) =>
    frame.contentWindow?.postMessage(
        {
            method: "pause",
        },
        "*"
    );

const pauseAlleVideoer = ({ aktivitetsmalId }: Aktivitet) => {
    document
        .querySelectorAll<HTMLIFrameElement>(
            `[data-aktivitetsmalid='${aktivitetsmalId}'] iframe`
        )
        .forEach(settVideoPåPause);
};

export const Aktivitetsrad = ({
    aktivitet,
    åpen = false,
    onClick,
    oppdaterValgteAktiviteter,
}: Props) => {
    const { orgnr } = useHentOrgnummer();

    useEffect(() => {
        if (!åpen) {
            pauseAlleVideoer(aktivitet);
        }
    }, [åpen]);

    const velgAktivitetHandler = (frist?: Date) => {
        loggVelgAktivitet(aktivitet);
        velgAktivitet({
            aktivitetsmalId: aktivitet.aktivitetsmalId,
            frist,
            orgnr: orgnr ?? undefined,
        })?.then(oppdaterValgteAktiviteter);
    };
    const fullførAktivitetHandler = () => {
        loggFullførAktivitet(aktivitet);
        fullførAktivitet({
            aktivitetsmalId: aktivitet.aktivitetsmalId,
            aktivitetsId: aktivitet.aktivitetsId,
            orgnr: aktivitet.orgnr ?? orgnr ?? undefined,
        })?.then(oppdaterValgteAktiviteter);
    };
    return (
        <Accordion.Item open={åpen}>
            <Accordion.Header
                onClick={onClick}
                className={AktivitetStatusStyle[aktivitet.status]}
            >
                {aktivitet.tittel}{" "}
                {aktivitet.status === "FULLFØRT" && (
                    <Tag variant="info">Fullført</Tag>
                )}{" "}
                {aktivitet.frist ?? ""}
            </Accordion.Header>
            <Accordion.Content data-aktivitetsmalid={aktivitet.aktivitetsmalId}>
                <Aktivitetsmal
                    aktivitet={aktivitet}
                    velgAktivitet={velgAktivitetHandler}
                    fullførAktivitet={fullførAktivitetHandler}
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
