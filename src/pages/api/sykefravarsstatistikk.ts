import { NextApiRequest, NextApiResponse } from "next";
import { logger } from "../../lib/logger";
import { erGyldigOrgnr } from "../../lib/orgnr";
import { proxyApiRouteRequest } from "@navikt/next-api-proxy";
import { withApiAuthentication } from "@navikt/tokenx-middleware";

const audience = process.env.SYKEFRAVARSSTATISTIKK_API_CLIENT_ID || "";

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse,
    accessToken: string
) => {
    const orgnr = req.query.orgnr as string;
    if (!erGyldigOrgnr(orgnr)) {
        return res.status(400).end('Parameter "orgnr" is invalid');
    }

    try {
        await proxyApiRouteRequest({
            hostname:
                process.env.SYKEFRAVARSSTATISTIKK_API_BASEURL?.replace(
                    "http://",
                    ""
                ) || "",
            path: `${orgnr}/v1/sykefravarshistorikk/aggregert`,
            req,
            res,
            https: true,
            bearerToken: accessToken,
        });
    } catch (error: unknown) {
        logger.error(error);
        return res.status(500).json({ message: "Unable to proxy request" });
    }
};

export default withApiAuthentication(handler, audience);
