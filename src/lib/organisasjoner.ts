import dns from "node:dns";
import { IncomingMessage } from "http";
import { logger } from "./logger";
import { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";
import { hentTokenXToken } from "../auth/hentTokenXToken";

dns.setDefaultResultOrder("ipv4first"); // Dette er for å få lokal kjøring til å virke med Node versjon 17.x med vårt oppsett

export async function hentOrganisasjoner(
    req: IncomingMessage
): Promise<Organisasjon[]> {
    const tokenxToken = await hentTokenXToken(
        req,
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
