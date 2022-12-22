import { NextApiRequest } from "next";
import { hentVerifisertToken } from "./index";
import { veksleToken } from "./tokenx";
import { IncomingMessage } from "http";
import { isLabs } from "../lib/miljø";

export async function hentTokenXToken(
    req: NextApiRequest | IncomingMessage,
    audience?: string
) {
    if (isLabs()) return "this-is-mock-labs-token";

    const token = await hentVerifisertToken(req);
    if (!token) {
        throw new Error("Kunne ikke verifisere token!");
    }
    return await veksleToken(token, audience);
}
