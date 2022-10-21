import {PortableTextMarkComponentProps} from "@portabletext/react";
import NextLink from "next/link";
import {Link} from "@navikt/ds-react";
import {ExternalLink} from "@navikt/ds-icons";

interface LenkeProps {
    erEksternLenke?: boolean;
    url?: string;
    _type: "link";
    text?: string;
}

export const Lenke = ({
                          text,
                          value: {erEksternLenke = false, url = "#"} = {_type: "link"},
                      }: PortableTextMarkComponentProps<LenkeProps>) => {
    return (
        <NextLink
            href={url}
            passHref
            target={erEksternLenke ? "_blank" : undefined}
        >
            <Link href={url}>
                {text}
                {erEksternLenke && <ExternalLink/>}
            </Link>
        </NextLink>
    );
};
