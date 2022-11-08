import { PortableTextBlock } from "@portabletext/types";

export interface Aktivitet {
    aktivitetsmalId: string;
    tittel: string;
    beskrivelse: string;
    mål: string;
    innhold: PortableTextBlock[];
    aktivitetsId?: number;
    status: AktivitetStatus;
    frist?: string;
}

export type AktivitetStatus = "IKKE_VALGT" | "VALGT" | "FULLFØRT"
