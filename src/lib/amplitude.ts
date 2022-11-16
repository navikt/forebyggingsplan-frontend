import { init, track } from "@amplitude/analytics-browser";
import { Aktivitet } from "../types/Aktivitet";

const AmplitudeBucket = {
    ARBEIDSGIVER_PROD: "a8243d37808422b4c768d31c88a22ef4",
    ARBEIDSGIVER_DEV: "6ed1f00aabc6ced4fd6fcb7fcdc01b30",
};

init(AmplitudeBucket.ARBEIDSGIVER_DEV, "", {
    serverUrl: "https://amplitude.nav.no/collect",
    useBatch: false,
});

export const defaultEventProperties = () => {
    return {
        app: "forebyggingsplan",
        team: "pia",
        url: window.location.pathname,
    };
};

export const loggÅpneAktivitet = (aktivitet: Aktivitet) => {
    sendAktivitetsEvent(aktivitet, "åpne");
};

export const loggVelgAktivitet = (aktivitet: Aktivitet) => {
    sendAktivitetsEvent(aktivitet, "velg");
};

export const loggFullførAktivitet = (aktivitet: Aktivitet) => {
    const hendelse =
        aktivitet.status == "VALGT" ? "fullført" : "detteHarViPåPlass";
    sendAktivitetsEvent(aktivitet, hendelse);
};

function sendAktivitetsEvent(aktivitet: Aktivitet, hendelse: string) {
    track("#forebyggingsplan-aktivitet", {
        ...defaultEventProperties(),
        hendelse: hendelse,
        tittel: aktivitet.tittel,
        beskrivelse: aktivitet.beskrivelse,
        aktivitetsmalId: aktivitet.aktivitetsmalId,
        versjon: aktivitet.aktivitetsmalVersjon,
    });
}
