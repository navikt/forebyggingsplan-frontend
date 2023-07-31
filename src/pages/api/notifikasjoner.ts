import { NextApiRequest, NextApiResponse } from "next";
import { hentTokenXToken } from "../../auth/hentTokenXToken";
import { logger } from "../../lib/logger";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    let token;
    try {
        token = await hentTokenXToken(
            req,
            process.env.IA_METRIKKER_API_CLIENT_ID,
        );
    } catch (e) {
        return res.status(401).end();
    }

    const data = await fetch(
        `notifikasjon-bruker-api.fager.svc.cluster.local/api/graphql`,
        {
            method: "POST",
            body: req.body,
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
        },
    )
        .then((res) => res.json())
        .catch((reason) => {
            logger.warn(reason);
            return res.status(500).json({
                error: "Fikk ikke hentet data fra notifikasjon-bruker-api",
            });
        });

    return res.status(200).json(data);
}
