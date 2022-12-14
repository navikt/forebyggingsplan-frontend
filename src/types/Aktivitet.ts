import { PortableTextBlock } from "@portabletext/types";

export interface Aktivitet {
    aktivitetsmalId: string;
    aktivitetsmalVersjon: string;
    tittel: string;
    beskrivelse: string;
    mål: string;
    innhold: PortableTextBlock[];
    status: AktivitetStatus;
    aktivitetsId?: number;
    frist?: string;
    fullførtTidspunkt?: string;
    orgnr?: string;
}

export type AktivitetStatus = "IKKE_VALGT" | "VALGT" | "FULLFØRT";

const AktivitetStatusSortering: { [key in AktivitetStatus]: number } = {
    VALGT: 1,
    IKKE_VALGT: 2,
    FULLFØRT: 3,
};

export const sorterStatus = (a: Aktivitet, b: Aktivitet) => {
    return (
        AktivitetStatusSortering[a.status] - AktivitetStatusSortering[b.status]
    );
};
