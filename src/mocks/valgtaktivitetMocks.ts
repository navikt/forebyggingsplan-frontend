import { rest } from "msw";
import { ValgtAktivitet } from "../types/ValgtAktivitet";

export const valgtAktivitetMocksHandlers = [
    rest.get(
        `${process.env.FOREBYGGINGSPLAN_API_BASEURL}/valgteaktiviteter/:orgnr`,
        async (req, res, ctx) => {
            const { orgnr } = req.params as { orgnr: string };

            return res(ctx.json(hentValgteAktiviteter(orgnr)));
        }
    ),
    rest.post(
        `${process.env.FOREBYGGINGSPLAN_API_BASEURL}/valgteaktiviteter/:orgnr`,
        async (req, res, ctx) => {
            const { orgnr } = req.params as { orgnr: string };
            const valgtAktivitet = {
                ...(await req.json<ValgtAktivitet>()),
                orgnr,
                valgtAv: {
                    orgnr,
                },
            };
            leggTilEllerOppdaterValgteAktivitet(orgnr, valgtAktivitet);

            return res(ctx.json(valgtAktivitet));
        }
    ),
    rest.post(
        `${process.env.FOREBYGGINGSPLAN_API_BASEURL}/fullfor/:orgnr`,
        async (req, res, ctx) => {
            const { orgnr } = req.params as { orgnr: string };
            const valgtAktivitet = {
                ...(await req.json<ValgtAktivitet>()),
                orgnr,
                valgtAv: {
                    orgnr,
                },
                fullført: true,
                fullførtTidspunkt: new Date().toISOString(),
            };
            leggTilEllerOppdaterValgteAktivitet(orgnr, valgtAktivitet);

            return res(ctx.json(valgtAktivitet));
        }
    ),
];

interface Meta {
    _sistOppdatert: number;
    _sistAkkessert: number;
}

type CacheEntry = ValgtAktivitet & Meta;

const valgtaAktiviteterMocks = new Map<string, CacheEntry[]>();

const leggTilEllerOppdaterValgteAktivitet = (
    orgnr: string,
    valgtAktivitet: ValgtAktivitet
) => {
    const list = valgtaAktiviteterMocks.get(orgnr) || [];
    const nå = new Date().getTime();

    if (
        list.some((e) => e.aktivitetsmalId === valgtAktivitet.aktivitetsmalId)
    ) {
        valgtaAktiviteterMocks.set(
            orgnr,
            list.map((e) => {
                if (e.aktivitetsmalId == valgtAktivitet.aktivitetsmalId)
                    return {
                        ...valgtAktivitet,
                        ...e,
                        _sistOppdatert: nå,
                    };
                else return e;
            })
        );
    } else {
        valgtaAktiviteterMocks.set(
            orgnr,
            list.concat({
                _sistOppdatert: nå,
                _sistAkkessert: nå,
                ...valgtAktivitet,
            })
        );
    }
};

const hentValgteAktiviteter = (orgnr: string) => {
    const nå = new Date().getTime();
    valgtaAktiviteterMocks.set(
        orgnr,
        (valgtaAktiviteterMocks.get(orgnr) || []).map((entry) => {
            return { ...entry, _sistAkkessert: nå };
        })
    );

    return (valgtaAktiviteterMocks.get(orgnr) || []) as ValgtAktivitet[];
};

const MAX_LEVETID_SIDEN_SIST_OPPDATERT_MS = 1000 * 60 * 30;
const MAX_LEVETID_SIDEN_SIST_AKSESSERT_MS = 1000 * 60 * 10;

function filtrerVekkGamleData(v: CacheEntry[], nå: number) {
    return v.filter(
        (e) =>
            nå - e._sistAkkessert < MAX_LEVETID_SIDEN_SIST_AKSESSERT_MS &&
            nå - e._sistOppdatert < MAX_LEVETID_SIDEN_SIST_OPPDATERT_MS
    );
}

const ryddOppMellomlager = () =>
    valgtaAktiviteterMocks.forEach((v, k, m) => {
        const nå = new Date().getTime();
        m.set(k, filtrerVekkGamleData(v, nå));
    });

setInterval(ryddOppMellomlager, 1000);
