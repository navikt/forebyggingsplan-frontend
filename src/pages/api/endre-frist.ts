import { NextApiRequest, NextApiResponse } from "next";
import { hentTokenXToken } from "../../auth/hentTokenXToken";
import { erGyldigOrgnr } from "../../lib/utils";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!req.body.orgnr)
        return res.status(400).json({ error: "Mangler 'orgnr' i body" });

    const requestBody = JSON.parse(
        JSON.stringify({
            aktivitetsId: req.body.aktivitetsId,
            aktivitetsmalId: req.body.aktivitetsmalId,
            frist: req.body.frist,
        })
    );
    const baseUrl = process.env.FOREBYGGINGSPLAN_API_BASEURL;

    let token;
    try {
        token = await hentTokenXToken(
            req,
            process.env.FOREBYGGINGSPLAN_CLIENT_ID
        );
    } catch (e) {
        return res.status(401).end();
    }

    const orgnr: string = req.body.orgnr;
    if (!erGyldigOrgnr(orgnr)) {
        return res.status(400).end();
    }

    const respons = await fetch(
        `${baseUrl}/valgteaktiviteter/${orgnr}/endre-frist`,
        {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );
    const { status, responseBody } = {
        status: respons.status,
        responseBody: respons.ok ? await respons.json() : await respons.text(),
    };
    res.status(status).json(responseBody);
}
