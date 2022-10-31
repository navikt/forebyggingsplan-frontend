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
            title: "Kategori",
            type: "reference",
            name: "kategori",
            to: [{
                type: "kategori"
            }]
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
                            title: "Overskrift",
                            value: "h1",
                        },
                        {
                            title: "Undertittel",
                            value: "h2",
                        },
                    ],
                    marks: {
                        decorators: [
                            {title: 'Strong', value: 'strong'},
                            {title: 'Emphasis', value: 'em'},
                            {title: "Underline", value: "underline"},
                        ],
                        annotations: [
                            {
                                type: "href"
                            },
                        ]
                    },
                },
                {
                    type: "seksjon"
                }
            ],
        },
    ],
};
