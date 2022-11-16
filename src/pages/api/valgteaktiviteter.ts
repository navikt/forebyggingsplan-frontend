import { NextApiRequest, NextApiResponse } from "next";
import { hentTokenXToken } from "../../auth/hentTokenXToken";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const token = await hentTokenXToken(
        req,
        res,
        process.env.FOREBYGGINGSPLAN_CLIENT_ID
    );
    const response = await fetch(
        `${process.env.FOREBYGGINGSPLAN_API_BASEURL}/valgteaktiviteter/${req.query.orgnr}`,
        {
            headers: {
                authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        return res.status(response.status).send(await response.text());
    }
    return res.status(200).json(await response.json());
}
