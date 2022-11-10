import { NextApiRequest, NextApiResponse } from "next";
import { hentVerifisertToken } from "./index";
import { veksleToken } from "./tokenx";

export async function hentTokenXToken(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const token = await hentVerifisertToken(req);
    if (!token) {
        return res.status(401).end();
    }
    return await veksleToken(token, process.env.FOREBYGGINGSPLAN_CLIENT_ID);
}
