import { Rule } from "@sanity/types";

export const aktivitet = {
    name: "Aktivitet",
    title: "Aktivitet i forebyggingsplan",
    type: "document",
    fields: [
        {
            title: "Kategori",
            type: "reference",
            name: "kategori",
            validation: (rule: Rule) =>
                rule
                    .required()
                    .error("Aktiviteter uten kategori vil ikke være synlig"),
            to: [
                {
                    type: "kategori",
                },
            ],
        },
        {
            type: "string",
            name: "tittel",
            title: "Tittel på aktiviteten",
            validation: (rule: Rule) => rule.required(),
        },
        {
            type: "string",
            name: "beskrivelse",
            title: "Generell beskrivelse på aktiviteten",
            description: "Forsøk å holde denne relativt kort.",
            validation: (rule: Rule) => rule.required(),
        },
        {
            type: "string",
            name: "maal",
            title: "Målbeskrivelse",
        },
        {
            title: "Innhold",
            name: "embeddedInnhold",
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
                            title: "Sitat",
                            value: "blockquote",
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
                    type: "seksjon",
                },
            ],
        },
    ],
};
