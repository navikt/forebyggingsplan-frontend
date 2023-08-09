import { rest } from "msw";
import { FullførtAktivitet } from "../../types/ValgtAktivitet";

export const valgtAktivitetHandlers = [
    rest.get(
        `${process.env.FOREBYGGINGSPLAN_API_BASEURL}/valgteaktiviteter/:orgnr`,
        async (req, res, ctx) => {
            const { orgnr } = req.params as { orgnr: string };

            return res(ctx.json(hentValgteAktiviteter(orgnr)));
        },
    ),
    rest.post(
        `${process.env.FOREBYGGINGSPLAN_API_BASEURL}/valgteaktiviteter/:orgnr`,
        async (req, res, ctx) => {
            const { orgnr } = req.params as { orgnr: string };
            const valgtAktivitet = {
                ...(await req.json<FullførtAktivitet>()),
                orgnr,
                valgtAv: {
                    orgnr,
                },
            };
            leggTilEllerOppdaterValgteAktivitet(orgnr, valgtAktivitet);

            return res(ctx.json(valgtAktivitet));
        },
    ),
    rest.post(
        `${process.env.FOREBYGGINGSPLAN_API_BASEURL}/fullfor/:orgnr`,
        async (req, res, ctx) => {
            const { orgnr } = req.params as { orgnr: string };
            const valgtAktivitet = {
                ...(await req.json<FullførtAktivitet>()),
                orgnr,
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

interface Meta {
    _sistOppdatert: number;
    _sistAkkessert: number;
}

type CacheEntry = FullførtAktivitet & Meta;

const valgtaAktiviteterMocks = new Map<string, CacheEntry[]>();
let idTeller = 1;

export const leggTilEllerOppdaterValgteAktivitet = (
    orgnr: string,
    valgtAktivitet: FullførtAktivitet,
) => {
    const list = valgtaAktiviteterMocks.get(orgnr) || [];
    const nå = new Date().getTime();

    if (list.some((e) => e.aktivitetsId === valgtAktivitet.aktivitetsId)) {
        valgtaAktiviteterMocks.set(
            orgnr,
            list.map((e) => {
                if (e.aktivitetsId == valgtAktivitet.aktivitetsId)
                    return {
                        ...e,
                        ...valgtAktivitet,
                        _sistOppdatert: nå,
                    };
                else return e;
            }),
        );
    } else {
        valgtaAktiviteterMocks.set(
            orgnr,
            list.concat({
                _sistOppdatert: nå,
                _sistAkkessert: nå,
                ...valgtAktivitet,
                id: idTeller++,
            }),
        );
    }
};

export const hentValgteAktiviteter = (orgnr: string) => {
    const nå = new Date().getTime();
    valgtaAktiviteterMocks.set(
        orgnr,
        (valgtaAktiviteterMocks.get(orgnr) || []).map((entry) => {
            return { ...entry, _sistAkkessert: nå };
        }),
    );

    return (valgtaAktiviteterMocks.get(orgnr) || []) as FullførtAktivitet[];
};

const MAX_LEVETID_SIDEN_SIST_OPPDATERT_MS = 1000 * 60 * 30;
const MAX_LEVETID_SIDEN_SIST_AKSESSERT_MS = 1000 * 60 * 10;

function filtrerVekkGamleData(v: CacheEntry[], nå: number) {
    return v.filter(
        (e) =>
            nå - e._sistAkkessert < MAX_LEVETID_SIDEN_SIST_AKSESSERT_MS &&
            nå - e._sistOppdatert < MAX_LEVETID_SIDEN_SIST_OPPDATERT_MS,
    );
}

const ryddOppMellomlager = () =>
    valgtaAktiviteterMocks.forEach((v, k, m) => {
        const nå = new Date().getTime();
        m.set(k, filtrerVekkGamleData(v, nå));
    });

setInterval(ryddOppMellomlager, 1000);
