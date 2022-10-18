export const aktivitet = {
    name: "Aktivitet",
    title: "Aktivitet i forebyggingsplan",
    type: "document",
    fields: [
        {
            type: "string",
            name: "tittel",
            title: "Tittel på aktiviteten",
        },
        {
            type: "string",
            name: "beskrivelse",
            title: "Generell beskrivelse på aktiviteten",
            description: "Forsøk å holde denne relativt kort.",
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
            of: [{ type: "block" }],
        },
    ],
};
