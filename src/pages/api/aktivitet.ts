import { NextApiRequest, NextApiResponse } from "next";
import { hentVerifisertToken } from "../../auth";
import { veksleToken } from "../../auth/tokenx";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = {
        aktivitetsmalId: req.body.id,
        orgnr: req.body.orgnr,
    };

    const baseUrl = process.env.FOREBYGGINGSPLAN_API_BASEURL;
    const token = await hentVerifisertToken(req);
    if (!token) {
        return res.send(401);
    }
    const tokenxToken = await veksleToken(
        token,
        process.env.FOREBYGGINGSPLAN_CLIENT_ID!!
    );

    const respons = await fetch(`${baseUrl}/valgteaktiviteter`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenxToken}`,
        },
    }).then((res) => {
        return res.json();
    });

    res.status(201).send(respons);
}
