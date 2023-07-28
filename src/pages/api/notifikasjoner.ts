import { NextApiRequest, NextApiResponse } from "next";
import { notifikasjonerMockdata } from "../../mocks/notifikasjonerMockdata";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    // TODO: Hente data og sånn. Inapirasjon fra src/pages/api/ia-metrikker.ts?

    return res.status(200).json(notifikasjonerMockdata);
}
