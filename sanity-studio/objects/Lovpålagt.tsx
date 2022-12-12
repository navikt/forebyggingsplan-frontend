import * as React from "react";
import { CSSProperties } from "react";
import { defineType } from "sanity";

interface Props {
    value: {
        tekst: string;
    };
}

const lovpalagdtStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "1rem",
    backgroundColor: "#fdE8e6",
    borderRadius: "4px",
};

const lovpalagdtTagStyle: CSSProperties = {
    padding: "0.25rem",
    backgroundColor: "#fdE8e6",
    border: "1px solid red",
    borderRadius: "4px",
    width: "max-content",
};

export const Lovpålagt = ({ value: { tekst } }: Props) => {
    return (
        <div style={lovpalagdtStyle}>
            <div style={lovpalagdtTagStyle}>Lovpålagt</div>
            {tekst}
        </div>
    );
};

const lovpålagtSchema = defineType({
    type: "object",
    name: "lovpalagt",
    title: "Lovpålagt tekstblokk",
    fields: [
        {
            type: "string",
            name: "tekst",
            title: "Tekstinnhold",
        },
    ],
    components: {
        preview: (props) => <>{props.media}</>,
    },
    preview: {
        select: {
            tekst: "tekst",
        },
        prepare: (value: { tekst: string }) => {
            return {
                title: "Innhold",
                media: <Lovpålagt value={{ tekst: value.tekst }} />,
            };
        },
    },
});
export default lovpålagtSchema;
