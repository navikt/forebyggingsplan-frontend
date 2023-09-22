import { NextApiRequest, NextApiResponse } from "next";
import { hentTokenXToken } from "../../../../auth/hentTokenXToken";
import { erGyldigOrgnr } from "../../../../lib/orgnr";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { orgnr } = req.query;

    if (typeof orgnr !== "string" || !erGyldigOrgnr(orgnr)) {
        return res.status(400).json({ error: "Mangler gyldig 'orgnr' i path" });
    }

    let veksletToken;
    try {
        veksletToken = await hentTokenXToken(
            req,
            process.env.FOREBYGGINGSPLAN_CLIENT_ID,
        );
    } catch (e) {
        return res.status(401).end();
    }

    const respons = await fetch(
        `${process.env.FOREBYGGINGSPLAN_API_BASEURL}/aktiviteter/orgnr/${orgnr}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${veksletToken}`,
            },
        },
    );

    return res.status(respons.status).json({ status: respons.status });
}
