import { NextApiRequest, NextApiResponse } from "next";
import {hentTokenXToken} from "../lib/hentTokenXToken";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = {
        aktivitetsmalId: req.body.id,
        orgnr: req.body.orgnr,
    };

    const baseUrl = process.env.FOREBYGGINGSPLAN_API_BASEURL;
    const token = await hentTokenXToken(req, res)

    const respons = await fetch(`${baseUrl}/valgteaktiviteter`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => res.json());

    res.status(201).send(respons);
}
