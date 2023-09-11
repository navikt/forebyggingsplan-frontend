import { track } from "@amplitude/analytics-browser";
import { Aktivitet } from "../types/Aktivitet";

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

export const loggMarkerSomGjort = (aktivitet: Aktivitet) => {
    const hendelse = "markertSomGjort";
    sendAktivitetsEvent(aktivitet, hendelse);
};

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
