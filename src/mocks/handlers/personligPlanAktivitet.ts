import { rest } from "msw";
import {
    hentValgteAktiviteter,
    leggTilEllerOppdaterValgteAktivitet,
} from "./valgtaktivitet";

export const personligPlanAktivitetHandlers = [
    rest.get(
        `${process.env.FOREBYGGINGSPLAN_API_BASEURL}/aktiviteter/orgnr/:orgnr/fullforte`,
        async (req, res, ctx) => {
            const { orgnr } = req.params as { orgnr: string };

            return res(ctx.json(hentValgteAktiviteter(orgnr)));
        },
    ),
    rest.post(
        `${process.env.FOREBYGGINGSPLAN_API_BASEURL}/aktivitet/:aktivitetsmalId/versjon/:versjon/orgnr/:orgnr/fullfor`,
        async (req, res, ctx) => {
            const { orgnr, versjon, aktivitetsmalId } = req.params as {
                orgnr: string;
                versjon: string;
                aktivitetsmalId: string;
            };
            const valgtAktivitet = {
                orgnr,
                aktivitetsVersjon: versjon,
                aktivitetsId: aktivitetsmalId,
                id: 1,
                valgtAv: {
                    orgnr,
                },
                fullført: true,
                fullførtTidspunkt: new Date().toISOString(),
            };
            leggTilEllerOppdaterValgteAktivitet(orgnr, valgtAktivitet);

            return res(ctx.json(valgtAktivitet));
        },
    ),
];
