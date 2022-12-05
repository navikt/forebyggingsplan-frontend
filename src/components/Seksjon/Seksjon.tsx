import {
    PortableText,
    PortableTextComponentProps,
    PortableTextComponents,
} from "@portabletext/react";
import { Lovpålagt } from "../Lovpålagt/Lovpålagt";
import { VideoVisning } from "../VideoVisning/VideoVisning";
import { PortableTextBlock } from "@portabletext/types";
import styles from "./Seksjon.module.css";
import { Bilde } from "../Bilde/Bilde";
import { block } from "../PortableText/block/Block";
import { marks } from "../PortableText/marks/Marks";
import { Sykefraværsstatistikk } from "../Sykefraværsstatistikk/Sykefraværsstatistikk";
import { LesMer } from "../LesMer/LesMer";
import { Oppgave } from "../../../sanity-studio/objects/Oppgave";

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
        oppgave: Oppgave,
        video: VideoVisning,
        bilde: Bilde,
        statistikk: Sykefraværsstatistikk,
        lesmer: LesMer,
    },
    block,
    marks,
};
