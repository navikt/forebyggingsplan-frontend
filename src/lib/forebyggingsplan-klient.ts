import {ValgtAktivitet} from "../types/ValgtAktivitet";
import useSWR from "swr";



const fetcher = (...args: [url: string, options?: RequestInit]) => fetch(...args).then((res) => res.json());

export function useHentValgteAktiviteter(orgnummer: string | null){
    const url = orgnummer ? `/api/valgteaktiviteter?orgnr=${orgnummer}` : null
    return useSWR<ValgtAktivitet[]>(url, fetcher)
}
