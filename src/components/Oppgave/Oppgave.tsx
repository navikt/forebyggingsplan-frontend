import React from "react";
import styles from "./Oppgave.module.css";
import { Heading, Panel } from "@navikt/ds-react";
import { PortableText, PortableTextComponentProps } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { block } from "../PortableText/block/Block";
import { marks } from "../PortableText/marks/Marks";
import { Statusendringsknapper } from "./Statusendringsknapper";
import { Statusvisning } from "./Statusvisning";
import { KollapsbarOppgavetekstContainer } from "./KollapsbarOppgavetekstContainer";

interface Props {
    tittel: string;
    innhold: PortableTextBlock[];
}

export type statusType = "urørt" | "under_arbeid" | "fullført";

export const Oppgave = ({
    value: { tittel, innhold },
}: PortableTextComponentProps<Props>) => {
    const [status, setStatus] = React.useState<statusType>("urørt");

    return (
        <Panel className={styles.oppgaveblokk}>
            <div className={styles.oppgaveinnhold}>
                <div className={styles.tittelContainer}>
                    <Heading size={"medium"} level="4" spacing>
                        Oppgave: {tittel}
                    </Heading>
                    <Statusvisning status={status} />
                </div>
                <KollapsbarOppgavetekstContainer
                    status={status}
                    knapper={
                        <Statusendringsknapper
                            status={status}
                            setNyStatus={setStatus}
                        />
                    }
                >
                    <PortableText
                        value={innhold}
                        components={{
                            block,
                            marks,
                        }}
                    />
                </KollapsbarOppgavetekstContainer>
            </div>
        </Panel>
    );
};
