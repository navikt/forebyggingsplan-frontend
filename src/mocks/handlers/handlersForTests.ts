import { rest } from "msw";
import {
    FULLFØR_AKTIVITET_PATH,
    HENT_VALGTE_AKTIVITETER_PATH,
    VELG_AKTIVITET_PATH,
} from "../../lib/klient/forebyggingsplan-klient";
import { HENT_SYKEFRAVERSSTATISTIKK_PATH } from "../../lib/klient/sykefraværsstatistikk-klient";
import { IA_METRIKK_PATH } from "../../lib/klient/ia-metrikker-klient";
import { sykefraværsstatistikkMock } from "../sykefraværsstatistikkMock";

export const handlersForTests = [
    rest.get(HENT_VALGTE_AKTIVITETER_PATH, async (req, res, ctx) => {
        return res(ctx.json([])); // Hent fra sessionstorage?
    }),
    rest.post(VELG_AKTIVITET_PATH, async (req, res, ctx) => {
        return res(ctx.json(null)); // Lagre
    }),
    rest.post(FULLFØR_AKTIVITET_PATH, async (req, res, ctx) => {
        return res(ctx.json(null)); // Lagre
    }),
    rest.get(HENT_SYKEFRAVERSSTATISTIKK_PATH, async (req, res, ctx) => {
        return res(ctx.json(sykefraværsstatistikkMock));
    }),
    rest.post(IA_METRIKK_PATH, async (req, res, ctx) => {
        return res(ctx.json({ status: "created" }));
    }),
];
