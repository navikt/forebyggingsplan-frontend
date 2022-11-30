import { PortableText, PortableTextComponentProps } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { ReadMore } from "@navikt/ds-react";
import { marks } from "../PortableText/marks/Marks";
import { block } from "../PortableText/block/Block";

export const LesMer = ({
    value,
}: PortableTextComponentProps<{
    tittel: string;
    innhold: PortableTextBlock[];
}>) => {
    return (
        <ReadMore header={value.tittel}>
            <PortableText
                value={value.innhold}
                components={{
                    block,
                    marks,
                }}
            />
        </ReadMore>
    );
};
