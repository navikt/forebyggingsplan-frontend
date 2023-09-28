import { rest } from "msw";
import { HENT_SYKEFRAVERSSTATISTIKK_PATH } from "../../lib/klient/sykefraværsstatistikk-klient";
import { IA_METRIKK_PATH } from "../../lib/klient/ia-metrikker-klient";
import { sykefraværsstatistikkMock } from "../sykefraværsstatistikkMock";

export const handlersForTests = [
    rest.get(HENT_SYKEFRAVERSSTATISTIKK_PATH, async (req, res, ctx) => {
        return res(ctx.json(sykefraværsstatistikkMock));
    }),
    rest.post(IA_METRIKK_PATH, async (req, res, ctx) => {
        return res(ctx.json({ status: "created" }));
    }),
];
