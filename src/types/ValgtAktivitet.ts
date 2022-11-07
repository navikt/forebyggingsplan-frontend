export interface ValgtAktivitet {
    id: number;
    aktivitetsmalId: string;
    valgtTidspunkt: string;
    valgtAv: {
        fnr: string;
        orgnr: string;
    };
    fullført: boolean;
    fullførtTidspunkt: string;
    opprettelsesTidspunkt: string;
}
