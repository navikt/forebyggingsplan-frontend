import { PortableText, PortableTextComponents } from "@portabletext/react";
import { Lovpålagt } from "../Lovpålagt/Lovpålagt";
import { VideoVisning } from "../VideoVisning/VideoVisning";
import { Heading } from "@navikt/ds-react";
import { Lenke } from "../Lenke/Lenke";
import { PortableTextComponentProps } from "@portabletext/react/src/types";
import { PortableTextBlock } from "@portabletext/types";
import styles from "./Seksjon.module.css";
import { Bilde } from "../Bilde/Bilde";

export const Seksjon = ({
    value,
}: PortableTextComponentProps<{
    seksjonInnhold: PortableTextBlock[];
}>) => (
    <div className={styles.seksjon}>
        <PortableText
            value={value.seksjonInnhold}
            components={seksjonsinnhold}
        />
    </div>
);

const seksjonsinnhold: Partial<PortableTextComponents> = {
    types: {
        lovpalagt: Lovpålagt,
        video: VideoVisning,
        bilde: Bilde,
    },
    block: {
        h2: ({ children }) => <Heading size="large">{children}</Heading>,
    },
    marks: {
        href: Lenke,
    },
};
