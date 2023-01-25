import { ValgtAktivitet } from "../types/ValgtAktivitet";
import useSWR from "swr";
import { isoDato } from "./dato";
import { logger } from "./logger";

export const HENT_VALGTE_AKTIVITETER_PATH = `/forebyggingsplan/api/valgteaktiviteter`;
export const VELG_AKTIVITET_PATH = "/forebyggingsplan/api/aktivitet";
export const ENDRE_FRIST_PATH = "/forebyggingsplan/api/endre-frist";
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
        if (!res.ok) {
            await logAndThrowException(res, VELG_AKTIVITET_PATH, "POST");
        }
        return res.json();
    });
}

interface EndreFristDTO {
    aktivitetsId: number;
    aktivitetsmalId: string;
    frist?: Date;
    orgnr?: string;
}

export function endreFrist(endreFristDTO: EndreFristDTO) {
    if (!endreFristDTO.orgnr) return;
    return fetch(ENDRE_FRIST_PATH, {
        method: "POST",
        body: JSON.stringify({
            aktivitetsId: endreFristDTO.aktivitetsId,
            aktivitetsmalId: endreFristDTO.aktivitetsmalId,
            frist: isoDato(endreFristDTO.frist),
            orgnr: endreFristDTO.orgnr,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    }).then(async (res) => {
        if (!res.ok) {
            await logAndThrowException(res, ENDRE_FRIST_PATH, "POST");
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
        if (!res.ok) {
            await logAndThrowException(res, FULLFØR_AKTIVITET_PATH, "POST");
        }
        return res.json();
    });
}

async function logAndThrowException(
    res: Response,
    url: string,
    method: string
) {
    const info = await res.text();
    logger.error(
        `${method} ${url} feilet med kode: ${res.status} og response: ${info}`
    );
    if (res.status >= 500) {
        throw new FetchingError("Serverfeil", res.status);
    }
    throw new FetchingError(`Klientfeil: ${info}`, res.status);
}
