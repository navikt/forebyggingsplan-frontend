import {
    sendIaMetrikk,
    MetrikkType,
    MetrikkKilde,
} from "@navikt/ia-metrikker-client";
import { logAndThrowException } from "./forebyggingsplan-klient";
import { logger } from "./logger-klient";

export const IA_METRIKK_PATH = "/forebyggingsplan/api/ia-metrikker";

export const lagreIaMetrikkInformasjonstjeneste = (orgnr: string | null) => {
    sendIaMetrikkEvent(orgnr, MetrikkType.INFORMASJONSTJENESTE);
};

export const lagreIaMetrikkInteraksjonstjeneste = (orgnr: string | null) => {
    sendIaMetrikkEvent(orgnr, MetrikkType.INTERAKSJONSTJENESTE);
};

const sendIaMetrikkEvent = (orgnr: string | null, type: MetrikkType) => {
    if (!orgnr) {
        logger.warn(
            `Orgnr er null, kan ikke sende IA-metrikker av type: ${type}`,
        );
        return;
    }

    return sendIaMetrikk(
        orgnr,
        type,
        MetrikkKilde.FOREBYGGINGSPLAN,
        IA_METRIKK_PATH,
    ).catch((res) => logAndThrowException(res, IA_METRIKK_PATH, "POST"));
};
