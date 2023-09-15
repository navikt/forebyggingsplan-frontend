import { Rule } from "@sanity/types";
import { orderRankField } from "@sanity/orderable-document-list";
import { defineType } from "sanity";

export const aktivitet = defineType({
    type: "document",
    name: "Aktivitet",
    title: "Aktivitet i forebyggingsplan",
    fields: [
        {
            title: "Kategori",
            name: "kategori",
            type: "reference",
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
            title: "Tittel på aktiviteten",
            name: "tittel",
            type: "string",
            validation: (rule: Rule) => rule.required(),
        },
        {
            title: "Generell beskrivelse på aktiviteten",
            description: "Forsøk å holde denne relativt kort.",
            name: "beskrivelse",
            type: "string",
            validation: (rule: Rule) => rule.required(),
        },
        {
            title: "Målbeskrivelse",
            name: "maal",
            type: "string",
            validation: (rule: Rule) => rule.required(),
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
                            title: "H4",
                            value: "h4",
                        },
                        {
                            title: "H5",
                            value: "h5",
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
                {
                    type: "oppgave",
                },
            ],
            validation: (rule: Rule) => rule.required(),
        },
        orderRankField({ type: "Aktivitet" }),
    ],
});
