export interface ValgtAktivitet {
    id: number;
    aktivitetsmalId: string;
    valgtAv: {
        fnr: string;
        orgnr: string;
    };
    frist?: string;
    fullført: boolean;
    fullførtTidspunkt: string;
    opprettelsesTidspunkt: string;
}
