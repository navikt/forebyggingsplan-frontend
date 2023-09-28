import { organisasjonerHandlers } from "./organisasjoner";
import { iaMetrikkerHandlers } from "./iaMetrikker";
import { sykefraværsstatistikkHandlers } from "./sykefraværsstatistikk";
import { handlersForTests } from "./handlersForTests";
import { notifikasjonerHandlers } from "./notifikasjoner";

export const handlers = [
    ...organisasjonerHandlers,
    ...sykefraværsstatistikkHandlers,
    ...iaMetrikkerHandlers,
    ...handlersForTests,
    ...notifikasjonerHandlers,
];
