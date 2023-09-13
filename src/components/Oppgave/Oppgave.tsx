import React from "react";
import styles from "./Oppgave.module.css";
import { Heading, Panel } from "@navikt/ds-react";
import { PortableText, PortableTextComponentProps } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { block } from "../PortableText/block/Block";
import { marks } from "../PortableText/marks/Marks";
import { Statusendringsknapper } from "./Statusendringsknapper";
import { Statusvisning } from "./Statusvisning";

interface Props {
    tittel: string;
    innhold: PortableTextBlock[];
}

export type statuser = "urørt" | "under_arbeid" | "fullført";

export const Oppgave = ({
    value: { tittel, innhold },
}: PortableTextComponentProps<Props>) => {
    const [status, setStatus] = React.useState<statuser>("urørt");

    return (
        <Panel className={styles.oppgaveblokk}>
            <div className={styles.oppgaveinnhold}>
                <div className={styles.tittelContainer}>
                    <Heading size={"medium"} level="4" spacing>
                        Oppgave: {tittel}
                    </Heading>
                    <Statusvisning status={status} />
                </div>
                <Statusendringsknapper
                    status={status}
                    setNyStatus={setStatus}
                />
                <hr />
                <PortableText
                    value={innhold}
                    components={{
                        block,
                        marks,
                    }}
                />
            </div>
        </Panel>
    );
};
