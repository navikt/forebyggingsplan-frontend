import { PortableTextBlock } from "@portabletext/types";

export interface Aktivitet {
    id: string;
    tittel: string;
    beskrivelse: string;
    mål: string;
    innhold: PortableTextBlock[];
    status: AktivitetStatus;
    frist?: string;
}

export type AktivitetStatus = "IKKE_VALGT" | "VALGT" | "FULLFØRT"
