import { logAndThrowException } from "./forebyggingsplan-klient";

export const IA_METRIKK_PATH = "/forebyggingsplan/api/ia-metrikker";
type MetrikkType = "INFORMASJONSTJENESTE" | "INTERAKSJONSTJENESTE";

export const lagreIaMetrikkInformasjonstjeneste = (orgnr: string | null) => {
    sendIaMetrikkEvent(orgnr, "INFORMASJONSTJENESTE");
};

export const lagreIaMetrikkInteraksjonstjeneste = (orgnr: string | null) => {
    sendIaMetrikkEvent(orgnr, "INTERAKSJONSTJENESTE");
};

const sendIaMetrikkEvent = (orgnr: string | null, type: MetrikkType) => {
    if (!orgnr) return;

    return fetch(IA_METRIKK_PATH, {
        method: "POST",
        body: JSON.stringify({
            orgnr: orgnr,
            type: type,
            kilde: "FOREBYGGINGSPLAN",
        }),
        headers: {
            "Content-Type": "application/json",
        },
    }).then(async (res) => {
        if (!res.ok) {
            await logAndThrowException(res, IA_METRIKK_PATH, "POST");
        }
        return res.json();
    });
};
