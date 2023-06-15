import { NextApiRequest, NextApiResponse } from "next";
import { erGyldigOrgnr } from "../../lib/orgnr";
import { exchangeIdportenSubjectToken } from "@navikt/tokenx-middleware/dist";

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
        })
    );

    const baseUrl = process.env.FOREBYGGINGSPLAN_API_BASEURL;

    const accessToken = await exchangeIdportenSubjectToken(
        req,
        process.env.FOREBYGGINGSPLAN_CLIENT_ID as string
    );
    if (!accessToken) {
        return res.status(401).end();
    }

    const orgnr: string = req.body.orgnr;
    if (!erGyldigOrgnr(orgnr)) {
        return res.status(400).end();
    }

    const respons = await fetch(`${baseUrl}/fullfor/${orgnr}`, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
        },
    });
    const { status, responseBody } = {
        status: respons.status,
        responseBody: respons.ok ? await respons.json() : await respons.text(),
    };
    res.status(status).json(responseBody);
}
