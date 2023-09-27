import { NextApiRequest, NextApiResponse } from "next";
import proxyRequestWithTokenExchange from "../../../lib/klient/api-proxy";
import { isLocalhost } from "../../../lib/utils/miljø";
import { notifikasjonerMockdata } from "../../../mocks/notifikasjonerMockdata";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    if (isLocalhost()) {
        return res.status(200).json(notifikasjonerMockdata);
    }

    return await proxyRequestWithTokenExchange(
        req,
        res,
        "notifikasjon-bruker-api.fager.svc.cluster.local",
        "/api/graphql",
        process.env.NOTIFIKASJON_API_AUDIENCE,
        false,
    );
}

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};
