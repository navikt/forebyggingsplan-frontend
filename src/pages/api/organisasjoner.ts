import {NextApiRequest, NextApiResponse} from "next";
import {hentToken} from "../../auth";
import {verifiserToken} from "../../auth/idporten";
import {veksleToken} from "../../auth/tokenx";
import {FOREBYGGINGSPLAN_API_BASEURL} from "../../constants";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = hentToken(req)
    if (!token) {
        return res.status(401).send("Unauthorized")
    }
    await verifiserToken(token);
    const tokenxToken = await veksleToken(
        token,
        process.env.FOREBYGGINGSPLAN_CLIENT_ID!!
    );

    const organisasjoner = await fetch(`${FOREBYGGINGSPLAN_API_BASEURL}/organisasjoner`, {
        headers: {
            authorization: `Bearer ${tokenxToken}`
        }
    }).then(res => res.json()).catch(console.error)
    return res.status(200).send(organisasjoner)
}