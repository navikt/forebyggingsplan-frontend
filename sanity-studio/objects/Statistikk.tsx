import * as React from "react";
import { CSSProperties } from "react";

const statistikkStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "1rem",
    borderRadius: "4px",
};

export const Statistikk = () => {
    return <div style={statistikkStyle}>Her er statistikk :)</div>;
};

const statistikkSchema = {
    type: "object",
    name: "statistikk",
    title: "Statistikk-blokk",
    fields: [
        {
            name: "langtidsfravar",
            type: "boolean",
            hidden: true,
        },
    ],
    preview: {
        component: Statistikk,
    },
};
export default statistikkSchema;
