import pino, { BaseLogger } from "pino";
import { NextApiRequest, NextApiResponse } from "next";
import { logger } from "../../lib/logger";

type LogLevels = Exclude<keyof BaseLogger, "string" | "level">;
const levels: LogLevels[] = [
    "error",
    "debug",
    "fatal",
    "info",
    "trace",
    "silent",
    "warn",
];

const validLabel = (label: unknown): label is LogLevels =>
    typeof label === "string" && levels.some((e) => e === label);

const loggingHandler = (req: NextApiRequest, res: NextApiResponse): void => {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method Not Allowed" });
        return;
    }

    const { level, ts }: pino.LogEvent = req.body;
    const label = level.label as unknown;
    const messages: [objOrMsg: unknown, msgOrArgs?: string] = req.body.messages;
    if (!validLabel(label)) {
        return res.status(400).json({
            error: `Invalid label ${label}`,
        });
    }
    const logChild = logger.child({
        x_timestamp: ts,
        x_isFrontend: true,
        x_userAgent: req.headers["user-agent"],
        x_request_id: req.headers["x-request-id"] ?? "not-set",
    });
    if (Object.hasOwn(logChild, label)) {
        logChild[label](...messages);
    }

    res.status(200).json({ ok: `ok` });
};

export default loggingHandler;
