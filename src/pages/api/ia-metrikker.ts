import { NextApiRequest, NextApiResponse } from "next";
import { logger } from "../../lib/logger";
import { exchangeIdportenSubjectToken } from "@navikt/tokenx-middleware/dist";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!req.body.orgnr)
        return res.status(400).json({ error: "Mangler 'orgnr' i body" });
    if (!req.body.type)
        return res.status(400).json({ error: "Mangler 'type' i body" });

    if (req.method !== "POST")
        return res.status(405).json({ error: "Method Not Allowed" });

    const requestBody = JSON.parse(
        JSON.stringify({
            orgnr: req.body.orgnr,
            type: req.body.type,
            kilde: "FOREBYGGINGSPLAN",
        })
    );

    const accessToken = await exchangeIdportenSubjectToken(
        req,
        process.env.IA_METRIKKER_API_CLIENT_ID as string
    );
    if (!accessToken) {
        return res.status(401).end();
    }

    const data = await fetch(
        `${process.env.IA_METRIKKER_API_BASEURL}/innlogget/mottatt-iatjeneste`,
        {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json",
                authorization: accessToken,
            },
        }
    )
        .then((res) => res.json())
        .catch(logger.warn);

    return res.status(200).json(data);
}
