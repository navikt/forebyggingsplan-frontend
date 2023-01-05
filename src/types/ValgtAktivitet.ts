export interface ValgtAktivitet {
    id: number;
    aktivitetsmalId: string;
    valgtAv: {
        orgnr: string;
    };
    frist?: string;
    fullført: boolean;
    fullførtTidspunkt: string;
    opprettelsesTidspunkt: string;
}
