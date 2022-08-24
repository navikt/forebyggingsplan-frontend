import { IncomingMessage } from "http";

export const hentToken = (req: IncomingMessage) =>
    req.headers.authorization?.split(" ")[1];
