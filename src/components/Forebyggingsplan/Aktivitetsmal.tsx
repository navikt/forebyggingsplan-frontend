import { Aktivitet } from "../../types/Aktivitet";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { Heading } from "@navikt/ds-react";

import styles from "./Aktivitetsmal.module.css";
import { Seksjon } from "../Seksjon/Seksjon";
import { block } from "../PortableText/block/Block";
import { marks } from "../PortableText/marks/Marks";

const hovedinnhold: Partial<PortableTextComponents> = {
    types: {
        seksjon: Seksjon,
    },
    block,
    marks,
};

export function Aktivitetsmal({
    aktivitet: { beskrivelse, innhold, mål },
}: {
    aktivitet: Aktivitet;
}) {
    return (
        <div className={styles.container}>
            {beskrivelse}
            <Heading size="medium" level="3">
                Mål
            </Heading>
            {mål}
            
            <PortableText value={innhold} components={hovedinnhold} />
        </div>
    );
}
