import { PortableText, PortableTextComponents } from "@portabletext/react";
import { BodyLong, Heading } from "@navikt/ds-react";
import styles from "./Aktivitetsmal.module.css";
import { Seksjon } from "../../Seksjon/Seksjon";
import { Oppgave } from "../../Oppgave/Oppgave";
import { block } from "../../PortableText/block/Block";
import { marks } from "../../PortableText/marks/Marks";
import { Aktivitet } from "../../../types/Aktivitet";
import { ProgressBarWithLabel } from "../../ProgressBar/ProgressBar";

const hovedinnhold: Partial<PortableTextComponents> = {
    types: {
        seksjon: Seksjon,
        oppgave: Oppgave,
    },
    block,
    marks,
};

interface AktivitetsmalProps {
    aktivitet: Aktivitet;
    max: number;
    value: number;
    inProgress: number;
}
export function Aktivitetsmal({
    aktivitet,
    max,
    value,
    inProgress,
}: AktivitetsmalProps) {
    return (
        <div className={styles.container}>
            <ProgressBarWithLabel
                max={max}
                value={value}
                inProgress={inProgress}
                label={"Aktivitet"}
                width="100%"
            />
            <BodyLong size="large">{aktivitet.beskrivelse}</BodyLong>
            <div className={styles.mål}>
                <Heading size="medium" level="4">
                    Mål
                </Heading>
                <BodyLong size="large">{aktivitet.mål}</BodyLong>
            </div>
            <PortableText value={aktivitet.innhold} components={hovedinnhold} />
        </div>
    );
}
