import * as React from "react";
import { PortableText } from "@portabletext/react";
import { Lovpålagt } from "./Lovpålagt";
import { VideoPreview } from "./Video";
import { Rule } from "@sanity/types";
import { PortableTextBlock } from "@portabletext/types";
import { Statistikk } from "./Statistikk";
import { Oppgave } from "./Oppgave";

export const seksjon = {
    type: "object",
    name: "seksjon",
    title: "Seksjon for innhold",
    fields: [
        {
            title: "Innhold",
            name: "seksjonInnhold",
            type: "array",
            of: [
                {
                    type: "block",
                    styles: [
                        {
                            title: "Normal tekst",
                            value: "normal",
                        },
                        {
                            title: "H3",
                            value: "h3",
                        },
                        {
                            title: "H4",
                            value: "h4",
                        },
                        {
                            title: "H5",
                            value: "h5",
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
                {
                    type: "lesmer",
                },
                {
                    type: "lovpalagt",
                },
                {
                    type: "oppgave",
                },
                {
                    type: "statistikk",
                },
                {
                    type: "video",
                },
                {
                    type: "image",
                    name: "bilde",
                    title: "Bilde",
                    fields: [
                        {
                            type: "string",
                            options: { isHighlighted: true },
                            name: "tittel",
                            title: "Tittel",
                            description: "Forklarende tittel til bildet",
                            validation: (rule: Rule) => rule.required(),
                        },
                        {
                            type: "string",
                            options: { isHighlighted: true },
                            name: "beskrivelse",
                            title: "Beskrivelse",
                            description:
                                "Skriv en forklarende tekst til bildet slik at det enkelt kan forstås av skjermlesere.",
                            validation: (rule: Rule) => rule.required(),
                        },
                    ],
                },
            ],
        },
    ],
    preview: {
        select: {
            seksjonInnhold: "seksjonInnhold",
        },
        component: (props: { value: { media: React.ReactNode } }) => {
            return <div>{props.value.media}</div>;
        },
        prepare: (value: { seksjonInnhold: PortableTextBlock }) => {
            return {
                title: "Innhold",
                media: (
                    <div
                        style={{
                            backgroundColor: "lightgray",
                            borderRadius: "4px",
                        }}
                    >
                        <PortableText
                            value={value.seksjonInnhold}
                            components={{
                                types: {
                                    lovpalagt: Lovpålagt,
                                    oppgave: Oppgave,
                                    statistikk: Statistikk,
                                    video: VideoPreview,
                                },
                            }}
                        />
                    </div>
                ),
            };
        },
    },
};
