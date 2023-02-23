import { NextApiRequest, NextApiResponse } from "next";
import { hentTokenXToken } from "../../auth/hentTokenXToken";
import { erGyldigOrgnr } from "../../lib/orgnr";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!req.query.orgnr)
        return res.status(400).json({ error: "Mangler parameter 'orgnr'" });

    const orgnr = req.query.orgnr;
    if (!erGyldigOrgnr(orgnr)) {
        return res.status(400).end();
    }

    let token;
    try {
        token = await hentTokenXToken(
            req,
            process.env.FOREBYGGINGSPLAN_CLIENT_ID
        );
    } catch (e) {
        return res.status(401).end();
    }
    const response = await fetch(
        `${process.env.FOREBYGGINGSPLAN_API_BASEURL}/valgteaktiviteter/${orgnr}`,
        {
            headers: {
                authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        return res
            .status(response.status)
            .setHeader("Content-Type", "text/plain")
            .send(await response.text());
    }
    return res.status(200).json(await response.json());
}
