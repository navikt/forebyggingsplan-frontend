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
import { useOppdaterStatus } from "../../lib/aktivitetStatus";
import { useHentOrgnummer } from "../Layout/Banner/Banner";
import { useStatusForAktivitet } from "../../lib/aktivitetStatus";

interface Props {
    tittel: string;
    innhold: PortableTextBlock[];
    id: string;
}

export type StatusType = "AVBRUTT" | "STARTET" | "FULLFØRT";

export const Oppgave = ({
    value: { tittel, innhold, id },
}: PortableTextComponentProps<Props>) => {
    const status = useStatusForAktivitet(id);
    const { orgnr } = useHentOrgnummer();
    const setStatus = useOppdaterStatus(orgnr, tittel, id);

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
