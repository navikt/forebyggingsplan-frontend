import { track } from "@amplitude/analytics-browser";
import { Aktivitet } from "../../types/Aktivitet";

export const defaultEventProperties = () => {
    return {
        app: "forebyggingsplan",
        team: "teamia",
        url: window.location.pathname,
    };
};

export const loggÅpneAktivitet = (aktivitet: Aktivitet) => {
    sendAktivitetsEvent(aktivitet, "åpne");
};

export function loggKnappetrykk(label: string, additional: object) {
    track("knapp", {
        ...additional,
        ...defaultEventProperties(),
        label,
    });
}

function sendAktivitetsEvent(aktivitet: Aktivitet, hendelse: string) {
    track("#forebyggingsplan-aktivitet", {
        ...defaultEventProperties(),
        hendelse: hendelse,
        tittel: aktivitet.tittel,
        beskrivelse: aktivitet.beskrivelse,
        aktivitetsmalId: aktivitet.aktivitetsmalId,
        aktivitetsmalVersjon: aktivitet.aktivitetsmalVersjon,
        status: aktivitet.status,
        frist: aktivitet.frist,
    });
}
