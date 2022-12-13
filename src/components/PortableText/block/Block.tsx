import { PortableTextReactComponents } from "@portabletext/react/src/types";
import { BodyLong, Heading } from "@navikt/ds-react";

export const block: PortableTextReactComponents["block"] = {
    h2: ({ children }) => (
        <Heading size="large" level="2">
            {children}
        </Heading>
    ),
    h3: ({ children }) => (
        <Heading size="medium" level="3">
            {children}
        </Heading>
    ),
    h4: ({ children }) => (
        <Heading size="medium" level="4">
            {children}
        </Heading>
    ),
    h5: ({ children }) => (
        <Heading size="small" level="5">
            {children}
        </Heading>
    ),
    h6: ({ children }) => (
        <Heading size="xsmall" level="6">
            {children}
        </Heading>
    ),
    normal: ({ children }) => <BodyLong spacing>{children}</BodyLong>,
};
