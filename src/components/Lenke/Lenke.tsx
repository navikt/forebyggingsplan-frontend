import { PortableTextMarkComponentProps } from "@portabletext/react";
import NextLink from "next/link";
import { ExternalLinkIcon } from "@navikt/aksel-icons";

interface LenkeProps {
    erEksternLenke?: boolean;
    url?: string;
    _type: "link";
    text?: string;
}

export const Lenke = ({
    text,
    value: { erEksternLenke = false, url = "#" } = { _type: "link" },
}: PortableTextMarkComponentProps<LenkeProps>) => {
    return (
        <NextLink
            href={url}
            className="navds-link"
            rel={"noreferrer noopener"}
            target={erEksternLenke ? "_blank" : undefined}
        >
            {text}
            {erEksternLenke && (
                <ExternalLinkIcon title="ekstern lenke, åpnes i ny tab" />
            )}
        </NextLink>
    );
};
