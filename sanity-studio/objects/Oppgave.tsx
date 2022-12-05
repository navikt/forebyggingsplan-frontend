import * as React from "react";
import styles from "./oppgavePeview.module.css";

interface Props {
    value: {
        tekst: string;
    };
}

export const Oppgave = ({ value: { tekst } }: Props) => {
    return (
        <div className={styles.oppgaveContainer}>
            <div className={styles.tag}>Oppgave</div>
            {tekst}
        </div>
    );
};

const oppgaveSchema = {
    type: "object",
    name: "oppgave",
    title: "Oppgave-tekstblokk",
    fields: [
        {
            type: "string",
            name: "tekst",
            title: "Tekstinnhold",
        },
    ],
    preview: {
        select: {
            tekst: "tekst",
        },
        component: Oppgave,
    },
};
export default oppgaveSchema;
