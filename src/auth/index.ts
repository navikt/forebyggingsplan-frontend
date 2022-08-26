import { IncomingMessage } from "http";

export const hentToken = (req: IncomingMessage) => {
    return req.headers.authorization?.split(" ")[1];
};
