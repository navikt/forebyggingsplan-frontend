import { rest } from "msw";

import { notifikasjonerMockdata } from "../notifikasjonerMockdata";

export const notifikasjonerHandlers = [
    rest.post(
        `/forebyggingsplan/api/authenticated/notifikasjoner`,
        async (req, res, ctx) => {
            const response = notifikasjonerMockdata;

            return res(ctx.json(response));
        },
    ),
];
