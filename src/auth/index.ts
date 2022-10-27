import { IncomingMessage } from "http";
import {verifiserToken} from "./idporten";

export const hentVerifisertToken = async (req: IncomingMessage) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
        await verifiserToken(token)
    }
    return token
};
