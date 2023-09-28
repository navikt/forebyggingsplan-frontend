import { logger } from "./logger-klient";

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
