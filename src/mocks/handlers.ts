import { rest } from "msw";
import {
    FULLFØR_AKTIVITET_PATH,
    HENT_VALGTE_AKTIVITETER_PATH,
    VELG_AKTIVITET_PATH,
} from "../lib/forebyggingsplan-klient";
import { HENT_SYKEFRAVERSSTATISTIKK_PATH } from "../lib/sykefraværsstatistikk-klient";
import { sykefraværsstatistikkMock } from "./sykefraværsstatistikkMock";

export const handlers = [
    rest.get("http://localhost:8081/organisasjoner", async (req, res, ctx) => {
        console.log("---> organisasjoner", req.url);
        return res(
            ctx.json([
                {
                    Name: "Forelder",
                    Type: "Enterprise",
                    OrganizationNumber: "811076112",
                    ParentOrganizationNumber: "",
                    OrganizationForm: "FLI",
                    Status: "Active",
                },
                {
                    Name: "BALLSTAD OG HAMARØY",
                    Type: "Business",
                    OrganizationNumber: "811076732",
                    ParentOrganizationNumber: "811076112",
                    OrganizationForm: "BEDR",
                    Status: "Active",
                },
            ])
        );
    }),
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
];
