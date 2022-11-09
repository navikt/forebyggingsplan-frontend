import { NextApiRequest, NextApiResponse } from "next";
import { hentTokenXToken } from "../../auth/hentTokenXToken";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const requestBody = JSON.parse(JSON.stringify({
        aktivitetsmalId: req.body.aktivitetsmalId,
        frist: req.body.frist
    }));

    const baseUrl = process.env.FOREBYGGINGSPLAN_API_BASEURL;
    const token = await hentTokenXToken(req, res);

    const respons = await fetch(`${baseUrl}/valgteaktiviteter/${req.body.orgnr}`, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
    const { status, responseBody } = {
        status : respons.status,
        responseBody : respons.ok ? await respons.json(): await respons.text()
    }
    res.status(status).json(responseBody);
}
