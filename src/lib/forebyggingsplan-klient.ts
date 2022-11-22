import { ValgtAktivitet } from "../types/ValgtAktivitet";
import useSWR from "swr";
import { isoDato } from "./dato";

export const HENT_VALGTE_AKTIVITETER_PATH = `/api/valgteaktiviteter`;
export const VELG_AKTIVITET_PATH = "/api/aktivitet";
export const FULLFØR_AKTIVITET_PATH = "/api/fullfor";

const fetcher = (...args: [url: string, options?: RequestInit]) =>
    fetch(...args).then((res) => res.json());

export function useHentValgteAktiviteter(orgnummer: string | null) {
    const url = orgnummer
        ? `${HENT_VALGTE_AKTIVITETER_PATH}?orgnr=${orgnummer}`
        : null;
    return useSWR<ValgtAktivitet[]>(url, fetcher);
}

interface ValgtAktivitetDTO {
    aktivitetsmalId: string;
    frist?: Date;
    orgnr?: string;
}

export function velgAktivitet(valgtAktivitetDto: ValgtAktivitetDTO) {
    if (!valgtAktivitetDto.orgnr) return;
    return fetch(VELG_AKTIVITET_PATH, {
        method: "POST",
        body: JSON.stringify({
            aktivitetsmalId: valgtAktivitetDto.aktivitetsmalId,
            frist: isoDato(valgtAktivitetDto.frist),
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
    orgnr?: string;
}

export function fullførAktivitet(fullførAktivitetDto: FullførAktivitetDTO) {
    if (!fullførAktivitetDto.orgnr) return;
    return fetch(FULLFØR_AKTIVITET_PATH, {
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
