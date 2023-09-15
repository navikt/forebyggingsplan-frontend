import { NextApiRequest, NextApiResponse } from "next";
import { hentTokenXToken } from "../../../../../../auth/hentTokenXToken";
import { erGyldigOrgnr } from "../../../../../../lib/orgnr";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { statusId, orgnr } = req.query;

    if (!statusId || typeof statusId !== "string")
        return res.status(400).json({ error: "Mangler 'statusId' i path" });

    if (!orgnr || typeof orgnr !== "string" || !erGyldigOrgnr(orgnr)) {
        return res.status(400).json({ error: "Mangler gyldig 'orgnr' i path" });
    }

    const baseUrl = process.env.FOREBYGGINGSPLAN_API_BASEURL;

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
        `${baseUrl}/status/${statusId}/orgnr/${orgnr}/oppdater`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${veksletToken}`,
            },
        },
    );
    res.status(respons.status).json({ status: respons.status });
}
