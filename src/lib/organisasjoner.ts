import dns from "node:dns";
import { IncomingMessage } from "http";
import { hentVerifisertToken } from "../auth";
import { veksleToken } from "../auth/tokenx";
import { FOREBYGGINGSPLAN_API_BASEURL } from "../constants";
import { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";

dns.setDefaultResultOrder('ipv4first'); // Dette er for å få lokal kjøring til å virke med Node versjon 17.x med vårt oppsett

export async function hentOrganisasjoner(req: IncomingMessage) {
    const token = await hentVerifisertToken(req);
    if (!token) {
        throw new Error("Unauthorized");
    }
    const tokenxToken = await veksleToken(
        token,
        process.env.FOREBYGGINGSPLAN_CLIENT_ID!!
    );

    const organisasjoner: Organisasjon[] = await fetch(
        `${FOREBYGGINGSPLAN_API_BASEURL}/organisasjoner`,
        {
            headers: {
                authorization: `Bearer ${tokenxToken}`,
            },
        }
    ).then((res) => res.json()).catch(console.trace);
    return organisasjoner;
}
