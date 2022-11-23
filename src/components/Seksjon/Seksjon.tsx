import { PortableText, PortableTextComponents } from "@portabletext/react";
import { Lovpålagt } from "../Lovpålagt/Lovpålagt";
import { VideoVisning } from "../VideoVisning/VideoVisning";
import { PortableTextComponentProps } from "@portabletext/react/src/types";
import { PortableTextBlock } from "@portabletext/types";
import styles from "./Seksjon.module.css";
import { Bilde } from "../Bilde/Bilde";
import { block } from "../PortableText/block/Block";
import { marks } from "../PortableText/marks/Marks";
import { Sykefraværsstatistikk } from "../Sykefraværsstatistikk/Sykefraværsstatistikk";

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
        statistikk: Sykefraværsstatistikk,
    },
    block,
    marks,
};
