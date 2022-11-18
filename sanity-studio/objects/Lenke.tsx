import { ExternalLink } from "@navikt/ds-icons";
import * as React from "react";

interface Props {
    url?: string;
    erEksternLenke: boolean;
    children?: React.ReactNode;
}

const Lenke = ({ children, erEksternLenke, url }: Props) => {
    return (
        <a href={url}>
            {children}
            {erEksternLenke && <ExternalLink />}
        </a>
    );
};

export const lenke = {
    name: "href",
    type: "object",
    title: "link",
    blockEditor: {
        icon: ExternalLink,
        render: Lenke,
    },
    fields: [
        {
            name: "url",
            type: "url",
        },
        {
            title: "Skal denne lenken åpnes i ny fane?",
            name: "erEksternLenke",
            type: "boolean",
        },
    ],
};
