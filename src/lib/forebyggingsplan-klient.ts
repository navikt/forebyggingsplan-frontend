import { ValgtAktivitet } from "../types/ValgtAktivitet";
import useSWR from "swr";

const fetcher = (...args: [url: string, options?: RequestInit]) =>
    fetch(...args).then((res) => res.json());

export function useHentValgteAktiviteter(orgnummer: string | null) {
    const url = orgnummer ? `/api/valgteaktiviteter?orgnr=${orgnummer}` : null;
    return useSWR<ValgtAktivitet[]>(url, fetcher);
}

interface ValgtAktivitetDTO {
    aktivitetsmalId: string;
    frist?: string;
    orgnr: string;
}

export function velgAktivitet(valgtAktivitetDto: ValgtAktivitetDTO) {
    return fetch("/api/aktivitet", {
        method: "POST",
        body: JSON.stringify({
            aktivitetsmalId: valgtAktivitetDto.aktivitetsmalId,
            frist: valgtAktivitetDto.frist,
            orgnr: valgtAktivitetDto.orgnr,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res) => {
        return res.json();
    });
}

interface FullførAktivitetDTO {
    aktivitetsId?: number;
    aktivitetsmalId: string;
    orgnr: string;
}

export function fullførAktivitet(fullførAktivitetDto: FullførAktivitetDTO) {
    return fetch("/api/fullfor", {
        method: "POST",
        body: JSON.stringify({
            aktivitetsId: fullførAktivitetDto.aktivitetsId,
            aktivitetsmalId: `${fullførAktivitetDto.aktivitetsmalId}`,
            orgnr: fullførAktivitetDto.orgnr,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res) => {
        return res.json();
    });
}
