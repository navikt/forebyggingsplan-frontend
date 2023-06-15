import dns from "node:dns";
import { IncomingMessage } from "http";
import { logger } from "./logger";
import { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";
import { exchangeIdportenSubjectToken } from "@navikt/tokenx-middleware/dist";

dns.setDefaultResultOrder("ipv4first"); // Dette er for å få lokal kjøring til å virke med Node versjon 17.x med vårt oppsett

export async function hentOrganisasjoner(
    req: IncomingMessage
): Promise<Organisasjon[]> {
    const accessToken = await exchangeIdportenSubjectToken(
        req,
        process.env.FOREBYGGINGSPLAN_CLIENT_ID as string
    );

    const response = await fetch(
        `${process.env.FOREBYGGINGSPLAN_API_BASEURL}/organisasjoner`,
        {
            headers: {
                authorization: accessToken as string,
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
