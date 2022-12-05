import * as React from "react";
import { CSSProperties } from "react";

interface Props {
    value: {
        tekst: string;
    };
}

const oppgaveStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "1rem",
    backgroundColor: "lightblue",
    borderRadius: "4px",
};

const oppgaveTagStyle: CSSProperties = {
    padding: "0.25rem",
    backgroundColor: "lighblue",
    border: "1px solid blue",
    borderRadius: "4px",
    width: "max-content",
};

export const Oppgave = ({ value: { tekst } }: Props) => {
    return (
        <div style={oppgaveStyle}>
            <div style={oppgaveTagStyle}>Oppgave</div>
            {tekst}
        </div>
    );
};

const oppgaveSchema = {
    type: "object",
    name: "oppgave",
    title: "Oppgave-tekstblokk",
    fields: [
        {
            type: "string",
            name: "tekst",
            title: "Tekstinnhold",
        },
    ],
    preview: {
        select: {
            tekst: "tekst",
        },
        component: Oppgave,
    },
};
export default oppgaveSchema;
