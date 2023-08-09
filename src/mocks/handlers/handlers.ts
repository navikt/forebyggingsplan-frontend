import { valgtAktivitetHandlers } from "./valgtaktivitet";
import { organisasjonerHandlers } from "./organisasjoner";
import { iaMetrikkerHandlers } from "./iaMetrikker";
import { sykefraværsstatistikkHandlers } from "./sykefraværsstatistikk";
import { handlersForTests } from "./handlersForTests";
import { notifikasjonerHandlers } from "./notifikasjoner";
import { personligPlanAktivitetHandlers } from "./personligPlanAktivitet";

export const handlers = [
    ...organisasjonerHandlers,
    ...sykefraværsstatistikkHandlers,
    ...iaMetrikkerHandlers,
    ...valgtAktivitetHandlers,
    ...handlersForTests,
    ...notifikasjonerHandlers,
    ...personligPlanAktivitetHandlers,
];
