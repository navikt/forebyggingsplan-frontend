import { NextApiRequest, NextApiResponse } from "next";
import { hentTokenXToken } from "../../auth/hentTokenXToken";
import { logger } from "../../lib/klient/logger-klient";
import { erGyldigOrgnr } from "../../lib/utils/orgnr";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "GET")
        return res.status(405).json({ error: "Method Not Allowed" });
    if (!req.query.orgnr)
        return res.status(400).json({ error: "Mangler parameter 'orgnr'" });

    let token;
    try {
        token = await hentTokenXToken(
            req,
            process.env.SYKEFRAVARSSTATISTIKK_API_CLIENT_ID,
        );
    } catch (e) {
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
                authorization: `Bearer ${token}`,
            },
        },
    )
        .then((res) => res.json())
        .catch((reason) => {
            logger.warn(reason);
        });

    return res.status(200).json(data);
}
