import { NextApiRequest, NextApiResponse } from "next";
import { erGyldigOrgnr } from "../../lib/orgnr";
import { exchangeIdportenSubjectToken } from "@navikt/tokenx-middleware/dist";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!req.query.orgnr)
        return res.status(400).json({ error: "Mangler parameter 'orgnr'" });

    const accessToken = await exchangeIdportenSubjectToken(
        req,
        process.env.FOREBYGGINGSPLAN_CLIENT_ID as string
    );
    if (!accessToken) {
        return res.status(401).end();
    }

    const orgnr = req.query.orgnr as string;
    if (!erGyldigOrgnr(orgnr)) {
        return res.status(400).end();
    }
    const response = await fetch(
        `${process.env.FOREBYGGINGSPLAN_API_BASEURL}/valgteaktiviteter/${orgnr}`,
        {
            headers: {
                authorization: accessToken,
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
