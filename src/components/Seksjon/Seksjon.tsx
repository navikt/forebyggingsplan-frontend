import { PortableText, PortableTextComponents } from "@portabletext/react";
import { Lovpålagt } from "../Lovpålagt/Lovpålagt";
import { VideoVisning } from "../VideoVisning/VideoVisning";
import { Heading } from "@navikt/ds-react";
import { Lenke } from "../Lenke/Lenke";
import { PortableTextComponentProps } from "@portabletext/react/src/types";
import { PortableTextBlock } from "@portabletext/types";

export const Seksjon = ({
    value,
}: PortableTextComponentProps<{
    seksjonInnhold: PortableTextBlock[];
}>) => (
    <div style={{
        backgroundColor: "lightgray",
        borderRadius: "4px",
        padding: "1rem"
    }}>
        <PortableText value={value.seksjonInnhold} components={seksjonsinnhold} />
    </div>
);
const seksjonsinnhold: Partial<PortableTextComponents> = {
    types: {
        lovpalagt: Lovpålagt,
        video: VideoVisning,
    },
    block: {
        h2: ({ children }) => <Heading size="large">{children}</Heading>,
    },
    marks: {
        href: Lenke,
    },
};
