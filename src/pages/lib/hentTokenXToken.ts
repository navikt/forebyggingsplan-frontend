import {NextApiRequest, NextApiResponse} from "next";
import {hentVerifisertToken} from "../../auth";
import {veksleToken} from "../../auth/tokenx";

export async function hentTokenXToken(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const token = await hentVerifisertToken(req);
    if (!token) {
        return res.status(401).end();
    }
    const tokenxToken = await veksleToken(
        token,
        process.env.FOREBYGGINGSPLAN_CLIENT_ID!!
    );
    return tokenxToken;
}