import * as React from "react";
import styles from "./oppgavePeview.module.css";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";

interface Props {
    value: {
        oppgavetype: string;
        tittel: string;
        innhold: PortableTextBlock[];
    };
}

export const Oppgave = ({ value: { oppgavetype, tittel, innhold } }: Props) => {
    return (
        <div className={styles.oppgaveContainer}>
            <div className={styles.tag}>{oppgavetype}</div>
            <h3>{tittel}</h3>
            <PortableText value={innhold} />
        </div>
    );
};

const oppgaveSchema = {
    type: "object",
    name: "oppgave",
    title: "Oppgave-tekstblokk",
    fields: [
        {
            title: "Oppgavetype",
            name: "oppgavetype",
            type: "string",
        },
        {
            title: "Oppgavetittel",
            name: "tittel",
            type: "string",
        },
        {
            title: "Innhold",
            name: "innhold",
            type: "array",
            of: [
                {
                    type: "block",
                    styles: [
                        {
                            title: "Normal tekst",
                            value: "normal",
                        },
                    ],
                    marks: {
                        decorators: [
                            { title: "Strong", value: "strong" },
                            { title: "Emphasis", value: "em" },
                            { title: "Underline", value: "underline" },
                        ],
                        annotations: [
                            {
                                type: "href",
                            },
                        ],
                    },
                },
            ],
        },
    ],
    preview: {
        select: {
            tittel: "tittel",
            innhold: "innhold",
            oppgavetype: "oppgavetype",
        },
        component: Oppgave,
    },
    initialValue: {
        oppgavetype: "Oppgave",
    },
};
export default oppgaveSchema;
