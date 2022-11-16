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
    const data = await fetch(
        `https://sykefravarsstatistikk-api.dev-fss-pub.nais.io/${req.query.orgnr}/v1/sykefravarshistorikk/aggregert`,
        {
            headers: {
                authorization: `Bearer ${token}`,
            },
        }
    ).then((res) => {
        return res.json();
    });
    return res.status(200).json(data);
}
