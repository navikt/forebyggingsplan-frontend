import { logAndThrowException } from "./forebyggingsplan-klient";

export const IA_METRIKK_PATH = "/forebyggingsplan/api/ia-metrikker";
type MetrikkType = "INFORMASJONSTJENESTE" | "INTERAKSJONSTJENESTE";

export const loggIaMetrikkInformasjonstjeneste = (orgnr: string | null) => {
    sendAktivitetsEvent(orgnr, "INFORMASJONSTJENESTE");
};

function sendAktivitetsEvent(orgnr: string | null, type: MetrikkType) {
    if (!orgnr) return;

    return fetch(IA_METRIKK_PATH, {
        method: "POST",
        body: JSON.stringify({
            orgnr: orgnr,
            type: type,
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
}
