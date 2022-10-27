import { NextApiRequest, NextApiResponse } from "next";
import { hentVerifisertToken } from "../../auth";
import { veksleToken } from "../../auth/tokenx";
import { FOREBYGGINGSPLAN_API_BASEURL } from "../../constants";

import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const token = await hentVerifisertToken(req);
    if (!token) {
        return res.status(401).send("Unauthorized");
    }
    const tokenxToken = await veksleToken(
        token,
        process.env.FOREBYGGINGSPLAN_CLIENT_ID!!
    );

    const organisasjoner = await fetch(
        `${FOREBYGGINGSPLAN_API_BASEURL}/organisasjoner`,
        {
            headers: {
                authorization: `Bearer ${tokenxToken}`,
            },
        }
    ).then((res) => res.json());
    return res.status(200).send(organisasjoner);
}