import { FullførtAktivitet } from "../types/ValgtAktivitet";
import useSWR from "swr";
import { logger } from "./logger";

export const HENT_VALGTE_AKTIVITETER_PATH = `/forebyggingsplan/api/valgteaktiviteter`;
export const VELG_AKTIVITET_PATH = "/forebyggingsplan/api/aktivitet";
export const FULLFØR_AKTIVITET_PATH = "/forebyggingsplan/api/fullfor";

export class FetchingError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        await logAndThrowException(res, url, "GET");
    }

    return res.json();
};

export function useHentValgteAktiviteter(orgnummer: string | null) {
    const url = orgnummer
        ? `${HENT_VALGTE_AKTIVITETER_PATH}?orgnr=${orgnummer}`
        : null;
    return useSWR<FullførtAktivitet[]>(url);
}

export async function logAndThrowException(
    res: Response,
    url: string,
    method: string,
) {
    const info = await res.text();
    logger.warn(
        `${method} ${url} feilet med kode: ${res.status} og response: ${info}`,
    );
    if (res.status >= 500) {
        throw new FetchingError("Serverfeil", res.status);
    }
    throw new FetchingError(`Klientfeil: ${info}`, res.status);
}
