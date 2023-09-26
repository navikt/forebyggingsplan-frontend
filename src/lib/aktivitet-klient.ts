import useSWR from "swr";
import { AktivitetBrukerStatus } from "./aktivitetStatus";

export const useHentAktiviteter = (orgnr: string | null) => {
    return useSWR<AktivitetBrukerStatus[]>(
        `/forebyggingsplan/api/aktiviteter/orgnr/${orgnr}`,
    );
};
