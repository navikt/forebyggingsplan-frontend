import { Aktivitet } from "../../types/Aktivitet";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { Heading } from "@navikt/ds-react";

import styles from "./Aktivitetsmal.module.css";
import { Lenke } from "../Lenke/Lenke";
import { Seksjon } from "../Seksjon/Seksjon";

const hovedinnhold: Partial<PortableTextComponents> = {
    types: {
        seksjon: Seksjon,
    },
    block: {
        h2: ({ children }) => <Heading size="large">{children}</Heading>,
    },
    marks: {
        href: Lenke,
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
            <PortableText value={innhold} components={hovedinnhold} />
        </div>
    );
}
