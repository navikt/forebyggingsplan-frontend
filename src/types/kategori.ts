import { PortableTextComponents } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { Aktivitet } from "./Aktivitet";
import { Sykefraværsstatistikk } from "../components/Sykefraværsstatistikk/Sykefraværsstatistikk";
import { block } from "../components/PortableText/block/Block";
import { marks } from "../components/PortableText/marks/Marks";

export interface Kategori {
    tittel: string;
    innhold: PortableTextBlock;
    aktiviteter: Aktivitet[];
}

export const kategoriComponents: Partial<PortableTextComponents> = {
    types: {
        statistikk: Sykefraværsstatistikk,
    },
    block,
    marks,
};
