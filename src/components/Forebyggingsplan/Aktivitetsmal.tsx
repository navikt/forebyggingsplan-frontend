import { Aktivitet } from "../../types/Aktivitet";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { Lovpålagt } from "../Lovpålagt/Lovpålagt";
import { Heading } from "@navikt/ds-react";
import styles from "./Aktivitetsmal.module.css";

const portableTextComponents: Partial<PortableTextComponents> = {
    types: {
        lovpalagt: Lovpålagt,
    },
    block: {
        h2: ({ children }) => <Heading size="large">{children}</Heading>,
    },
};

export function Aktivitetsmal({
    aktivitet: { beskrivelse, innhold, mål },
}: {
    aktivitet: Aktivitet;
}) {
    return (
        <div className={styles.container}>
            {beskrivelse}
            <Heading size="large">Mål</Heading>
            {mål}
            <Heading size="large">Slik gjør du det</Heading>
            <PortableText value={innhold} components={portableTextComponents} />
        </div>
    );
}
