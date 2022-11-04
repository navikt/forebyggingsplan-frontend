import { NextApiRequest, NextApiResponse } from "next";
import { hentTokenXToken } from "../lib/hentTokenXToken";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const token = await hentTokenXToken(req, res);
    const data = await fetch(
        `${process.env.FOREBYGGINGSPLAN_API_BASEURL}/valgteaktiviteter/${req.query.orgnr}`,
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
