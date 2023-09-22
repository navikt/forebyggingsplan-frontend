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
import { oppdaterStatus } from "../../lib/status-klient";
import { useHentOrgnummer } from "../Layout/Banner/Banner";
import { useStatusForAktivitet } from "../../lib/aktivitet-klient";

interface Props {
    tittel: string;
    innhold: PortableTextBlock[];
    id: string;
}

export type StatusType = "AVBRUTT" | "STARTET" | "FULLFØRT";

export const Oppgave = ({
    value: { tittel, innhold, id },
}: PortableTextComponentProps<Props>) => {
    const [status, setLokalStatus] = React.useState<StatusType | undefined>(
        "AVBRUTT",
    );
    const { orgnr } = useHentOrgnummer();

    const aktivitetsStatus = useStatusForAktivitet(id);

    React.useEffect(() => {
        if (aktivitetsStatus) {
            setLokalStatus(aktivitetsStatus);
        }
    }, [aktivitetsStatus]);

    const setStatus = React.useCallback(
        (nyStatus: StatusType) => {
            setLokalStatus(nyStatus);
            if (orgnr) {
                oppdaterStatus(id, orgnr, nyStatus);
            } else {
                console.error("Får ikke oppdatert status. Mangler orgnr.");
            }
        },
        [setLokalStatus, id, orgnr],
    );

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
