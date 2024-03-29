import * as React from "react";
import { PortableText } from "@portabletext/react";
import { LovpålagtPreview } from "./Lovpålagt";
import { VideoPreview } from "./Video";
import { Rule } from "@sanity/types";
import { PortableTextBlock } from "@portabletext/types";
import { StatistikkPreview } from "./Statistikk";
import { defineType } from "sanity";
import { uuid } from "@sanity/uuid";

export const seksjon = defineType({
    type: "object",
    name: "seksjon",
    title: "Seksjon for innhold",
    fields: [
        {
            title: "ID",
            name: "id",
            type: "string",
            readOnly: false, // TODO: Sett til true når alle har ID
            initialValue: () => uuid(),
        },
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
                            title: "H4",
                            value: "h4",
                        },
                        {
                            title: "H5",
                            value: "h5",
                        },
                        {
                            title: "H6",
                            value: "h6",
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
                            name: "tittel",
                            title: "Tittel",
                            description: "Forklarende tittel til bildet",
                            validation: (rule: Rule) => rule.required(),
                        },
                        {
                            type: "string",
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
    components: {
        preview: (props) => <>{props.media}</>,
    },
    preview: {
        select: {
            seksjonInnhold: "seksjonInnhold",
        },
        prepare: (value: { seksjonInnhold: PortableTextBlock }) => {
            return {
                title: "Innhold",
                media: (
                    <div
                        style={{
                            backgroundColor: "#f1f1f1",
                            borderRadius: "4px",
                            padding: "1rem",
                        }}
                    >
                        <PortableText
                            value={value.seksjonInnhold}
                            components={{
                                types: {
                                    lovpalagt: LovpålagtPreview,
                                    statistikk: StatistikkPreview,
                                    video: VideoPreview,
                                },
                            }}
                        />
                    </div>
                ),
            };
        },
    },
});
