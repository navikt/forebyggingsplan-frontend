import { PortableText, PortableTextComponentProps } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { ReadMore } from "@navikt/ds-react";
import { marks } from "../PortableText/marks/Marks";
import { block } from "../PortableText/block/Block";

export const LesMer = ({
    value: { innhold, tittel },
}: PortableTextComponentProps<{
    tittel: string;
    innhold: PortableTextBlock[];
}>) => (
    <ReadMore header={tittel}>
        <PortableText
            value={innhold}
            components={{
                block,
                marks,
            }}
        />
    </ReadMore>
);
