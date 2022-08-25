import { IncomingMessage } from "http";

export const hentToken = (req: IncomingMessage) => {
    console.log(JSON.stringify(req.headers));
    return req.headers.authorization?.split(" ")[1];
};
