import dns from "node:dns";
import { IncomingMessage } from "http";
import { hentVerifisertToken } from "../auth";
import { veksleToken } from "../auth/tokenx";
import { logger } from "./logger";
import { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";

dns.setDefaultResultOrder("ipv4first"); // Dette er for å få lokal kjøring til å virke med Node versjon 17.x med vårt oppsett

export async function hentOrganisasjoner(
    req: IncomingMessage
): Promise<Organisasjon[]> {
    const token = await hentVerifisertToken(req);
    if (!token) {
        throw new Error("Unauthorized");
    }
    const tokenxToken = await veksleToken(
        token,
        process.env.FOREBYGGINGSPLAN_CLIENT_ID
    );

    const response = await fetch(
        `${process.env.FOREBYGGINGSPLAN_API_BASEURL}/organisasjoner`,
        {
            headers: {
                authorization: `Bearer ${tokenxToken}`,
            },
        }
    );
    if (!response.ok) {
        logger.error(
            `Klarte ikke å hente organisasjoner ${await response.text()}`
        );
        throw new Error("Klarte ikke å hente organisasjoner");
    }
    return response.json();
}
