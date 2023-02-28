import { rest } from "msw";
import { sykefraværsstatistikkMock } from "../sykefraværsstatistikkMock";

export const sykefraværsstatistikkHandlers = [
    rest.get(
        `${process.env.SYKEFRAVARSSTATISTIKK_API_BASEURL}/:orgnr/v1/sykefravarshistorikk/aggregert`,
        async (req, res, ctx) => {
            return res(ctx.json(sykefraværsstatistikkMock));
        }
    ),
];
