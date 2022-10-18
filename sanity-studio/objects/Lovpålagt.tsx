import * as React from "react"

interface Props {
    value: {
        tekst: string
    }
}

const Lovpålagt = ({ value: { tekst }}: Props) => {
    return <div>
        {tekst}
    </div>
};

export default {
    type: "object",
    name: "lovpalagt",
    title: "Lovpålagt tekstblokk",
    fields: [{
        type: "string",
        name: "tekst",
        title: "Tekstinnhold",
    }],
    preview: {
        select: {
            tekst: "tekst"
        },
        component: Lovpålagt
    },
};

