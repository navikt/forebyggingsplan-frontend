import { NextApiRequest, NextApiResponse } from "next";
import { logger } from "../../lib/logger";
import { erGyldigOrgnr } from "../../lib/orgnr";
import { exchangeIdportenSubjectToken } from "@navikt/tokenx-middleware/dist";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET")
        return res.status(405).json({ error: "Method Not Allowed" });
    if (!req.query.orgnr)
        return res.status(400).json({ error: "Mangler parameter 'orgnr'" });

    const accessToken = await exchangeIdportenSubjectToken(
        req,
        process.env.SYKEFRAVARSSTATISTIKK_API_CLIENT_ID as string
    );
    if (!accessToken) {
        return res.status(401).end();
    }

    const orgnr = req.query.orgnr as string;
    if (!erGyldigOrgnr(orgnr)) {
        return res.status(400).end();
    }
    const data = await fetch(
        `${process.env.SYKEFRAVARSSTATISTIKK_API_BASEURL}/${orgnr}/v1/sykefravarshistorikk/aggregert`,
        {
            headers: {
                authorization: accessToken,
            },
        }
    )
        .then((res) => res.json())
        .catch((reason) => {
            logger.warn(reason);
        });

    return res.status(200).json(data);
}
