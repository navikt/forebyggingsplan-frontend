import pino from "pino";

export const frontendLogger = (): pino.Logger =>
    pino({
        browser: {
            transmit: {
                send: async (_, logEvent) => {
                    try {
                        // If your app uses a basePath, you'll need to add it to the path here
                        await fetch(`/api/logger`, {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify(
                                // Hackily massage messages from exceptions into being { err: {...} } to normalize how logging looks
                                errorifyMessages(logEvent)
                            ),
                        });
                    } catch (e) {
                        console.warn(e);
                        console.warn("Unable to log to backend", logEvent);
                    }
                },
            },
        },
    });

function errorifyMessages(logEvent: pino.LogEvent): pino.LogEvent {
    logEvent.messages = logEvent.messages.map((message) => {
        if (typeof message === "object" && "stack" in message) {
            return {
                err: {
                    type: message.type,
                    stack: message.stack,
                    message: message.msg ?? message.message,
                },
            };
        }
        return message;
    });

    return logEvent;
}

export const backendLogger = (defaultConfig = {}): pino.Logger =>
    pino({
        ...defaultConfig,
        timestamp: false,
        formatters: {
            level: (label) => {
                return { level: label };
            },
            log: (object: any) => {
                if (object.err) {
                    // backendlogger has an Error-instance, frontendlogger has already serialized it
                    const err =
                        object.err instanceof Error
                            ? pino.stdSerializers.err(object.err)
                            : object.err;
                    object.stack_trace = err.stack;
                    object.type = err.type;
                    object.message = err.message;
                    delete object.err;
                }

                return object;
            },
        },
    });

// This logger is isomorphic, and can be imported from anywhere in the app
export const logger =
    typeof window !== "undefined" ? frontendLogger() : backendLogger();
