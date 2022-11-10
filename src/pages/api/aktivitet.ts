import { NextApiRequest, NextApiResponse } from "next";
import { hentTokenXToken } from "../../auth/hentTokenXToken";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = {
        aktivitetsmalId: req.body.aktivitetsmalId,
    };

    const baseUrl = process.env.FOREBYGGINGSPLAN_API_BASEURL;
    const token = await hentTokenXToken(req, res);

    const respons = await fetch(
        `${baseUrl}/valgteaktiviteter/${req.body.orgnr}`,
        {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    ).then((res) => {
        if (res.ok) return { status: res.status, body: res.json() };
        return { status: res.status, body: res.text() };
    });

    res.status(respons.status).send(respons.body);
}
