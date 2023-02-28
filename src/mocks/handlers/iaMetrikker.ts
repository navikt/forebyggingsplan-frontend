import { rest } from "msw";

export const iaMetrikkerHandlers = [
    rest.post(
        `${process.env.IA_METRIKKER_API_BASEURL}/innlogget/mottatt-iatjeneste`,
        async (req, res, ctx) => {
            const response = {
                status: "created",
            };
            return res(ctx.json(response));
        }
    ),
];
