import { NextApiRequest, NextApiResponse } from "next";
import { hentTokenXToken } from "../../auth/hentTokenXToken";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = {
        aktivitetsId: req.body.aktivitetsId,
    };

    const baseUrl = process.env.FOREBYGGINGSPLAN_API_BASEURL;
    const token = await hentTokenXToken(req, res);

    const respons = await fetch(`${baseUrl}/fullfor/${req.body.orgnr}`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => res.json());

    res.status(respons.status).send(respons);
}
