import { ValgtAktivitet } from "../types/ValgtAktivitet";
import useSWR from "swr";
import { isoDato } from "./dato";

export const HENT_VALGTE_AKTIVITETER_PATH = `/forebyggingsplan/api/valgteaktiviteter`;
export const VELG_AKTIVITET_PATH = "/forebyggingsplan/api/aktivitet";
export const FULLFØR_AKTIVITET_PATH = "/forebyggingsplan/api/fullfor";

class FetchingError extends Error {
    info: unknown;
    status: number;

    constructor(message: string, info: unknown, status: number) {
        super(message);
        this.info = info;
        this.status = status;
    }
}

export const fetcher = async (url: string) => {
    const res = await fetch(url);
    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) {
        let info;
        try {
            info = await res.json();
        } catch (e) {
            info = await res.text();
        }
        throw new FetchingError(
            "An error occurred while fetching the data.",
            info,
            res.status
        );
    }

    return res.json();
};

export function useHentValgteAktiviteter(orgnummer: string | null) {
    const url = orgnummer
        ? `${HENT_VALGTE_AKTIVITETER_PATH}?orgnr=${orgnummer}`
        : null;
    return useSWR<ValgtAktivitet[]>(url);
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
    }).then(async (res) => {
        // If the status code is not in the range 200-299,
        // we still try to parse and throw it.
        if (!res.ok) {
            let info;
            try {
                info = await res.json();
            } catch (e) {
                info = await res.text();
            }
            throw new FetchingError(
                "An error occurred while fetching the data.",
                info,
                res.status
            );
        }
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
    }).then(async (res) => {
        // If the status code is not in the range 200-299,
        // we still try to parse and throw it.
        if (!res.ok) {
            let info;
            try {
                info = await res.json();
            } catch (e) {
                info = await res.text();
            }
            throw new FetchingError(
                "An error occurred while fetching the data.",
                info,
                res.status
            );
        }
        return res.json();
    });
}
