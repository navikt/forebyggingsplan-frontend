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
