import { NextApiRequest, NextApiResponse } from "next";
import { erGyldigOrgnr } from "../../lib/orgnr";
import { proxyApiRouteRequest } from "@navikt/next-api-proxy";
import { withApiAuthentication } from "@navikt/tokenx-middleware";

const audience = process.env.IA_METRIKKER_API_CLIENT_ID || "";

const handler = async function (
    req: NextApiRequest,
    res: NextApiResponse,
    accessToken: string
) {
    const orgnr = req.query.orgnr as string;
    const typeTjeneste = req.body.type as string;

    if (!erGyldigOrgnr(orgnr)) {
        return res.status(400).end('Parameter "orgnr" is invalid');
    }
    if (!typeTjeneste)
        return res.status(400).json({ error: "Mangler 'type' i body" });

    await proxyApiRouteRequest({
        hostname:
            process.env.IA_METRIKKER_API_BASEURL?.replace("http://", "") || "",
        path: `/innlogget/mottatt-iatjeneste`,
        req,
        res,
        https: false,
        bearerToken: accessToken,
    });
};

export default withApiAuthentication(handler, audience);

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};
