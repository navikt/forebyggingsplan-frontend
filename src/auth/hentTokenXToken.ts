import { NextApiRequest } from "next";
import { hentVerifisertToken } from "./index";
import { veksleToken } from "./tokenx";
import { IncomingMessage } from "http";

export async function hentTokenXToken(
    req: NextApiRequest | IncomingMessage,
    audience?: string
) {
    const token = await hentVerifisertToken(req);
    if (!token) {
        throw new Error("Kunne ikke verifisere token!");
    }
    return await veksleToken(token, audience);
}
