import { Rule } from "@sanity/types";
import { orderRankField } from "@sanity/orderable-document-list";

export const kategori = {
    name: "kategori",
    title: "Kategori til aktiviteter",
    type: "document",
    fields: [
        {
            title: "Tittel",
            name: "tittel",
            type: "string",
            validation: (rule: Rule) => rule.required(),
        },
        {
            title: "Innledning",
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
                        decorators: [],
                        annotations: [],
                    },
                },
                {
                    type: "statistikk",
                },
            ],
            validation: (rule: Rule) => rule.required(),
        },
        orderRankField({ type: "kategori" }),
    ],
};
