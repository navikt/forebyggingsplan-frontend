import { NextApiRequest, NextApiResponse } from "next";
import { hentTokenXToken } from "../../auth/hentTokenXToken";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const token = await hentTokenXToken(
        req,
        res,
        "dev-fss:arbeidsgiver:sykefravarsstatistikk-api"
    );
    const response = await fetch(
        `https://sykefravarsstatistikk-api.dev-fss-pub.nais.io/sykefravarsstatistikk-api/${req.query.orgnr}/v1/sykefravarshistorikk/aggregert`,
        {
            headers: {
                authorization: `Bearer ${token}`,
            },
        }
    );
    if (!response.ok)
        return res.status(response.status).send(await response.text());

    return res.status(200).json(await response.json());
}
