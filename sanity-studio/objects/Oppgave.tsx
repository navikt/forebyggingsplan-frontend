import * as React from "react";
import styles from "./oppgavePreview.module.css";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { defineType } from "sanity";
import { uuid } from "@sanity/uuid";

interface Props {
    value: {
        oppgavetype: string;
        tittel: string;
        innhold: PortableTextBlock[];
    };
}

export const OppgavePreview = ({
    value: { oppgavetype, tittel, innhold },
}: Props) => {
    return (
        <div className={styles.oppgaveContainer}>
            <div className={styles.tag}>{oppgavetype}</div>
            <h3>{tittel}</h3>
            <PortableText value={innhold} />
        </div>
    );
};

const oppgaveSchema = defineType({
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
            title: "ID",
            name: "id",
            type: "string",
            readOnly: true,
            initialValue: () => uuid(),
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
    components: {
        preview: (props) => <>{props.media}</>,
    },
    preview: {
        select: {
            tittel: "tittel",
            innhold: "innhold",
            oppgavetype: "oppgavetype",
        },
        prepare: (props: {
            oppgavetype: string;
            tittel: string;
            innhold: PortableTextBlock[];
        }) => {
            return {
                title: "Innhold",
                media: (
                    <OppgavePreview
                        value={{
                            oppgavetype: props.oppgavetype,
                            innhold: props.innhold,
                            tittel: props.tittel,
                        }}
                    />
                ),
            };
        },
    },
    initialValue: {
        oppgavetype: "Oppgave",
    },
});

export default oppgaveSchema;
