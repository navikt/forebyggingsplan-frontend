import { Rule } from "@sanity/types";

export const kategori = {
    name: "kategori",
    title: "Kategori til aktiviteter",
    type: "document",
    fields: [
        {
            type: "string",
            name: "tittel",
            title: "Tittel",
            validation: (rule: Rule) => rule.required(),
        },
        {
            type: "string",
            name: "beskrivelse",
            title: "Innledning",
            validation: (rule: Rule) => rule.required(),
        },
    ],
};
