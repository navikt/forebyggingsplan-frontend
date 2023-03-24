import { PortableText, PortableTextComponents } from "@portabletext/react";
import { Alert, BodyShort, Heading, Ingress } from "@navikt/ds-react";
import styles from "./Aktivitetsmal.module.css";
import { Seksjon } from "../../Seksjon/Seksjon";
import { Oppgave } from "../../Oppgave/Oppgave";
import { block } from "../../PortableText/block/Block";
import { marks } from "../../PortableText/marks/Marks";
import { Aktivitet } from "../../../types/Aktivitet";
import { DetteHarViGjort } from "./DetteHarViGjort/DetteHarViGjort";

const hovedinnhold: Partial<PortableTextComponents> = {
    types: {
        seksjon: Seksjon,
        oppgave: Oppgave,
    },
    block,
    marks,
};

interface AktivitetsmalProps {
    aktivitet: Aktivitet;
    velgAktivitet: (frist?: Date) => Promise<void> | undefined;
    fullførAktivitet: () => void;
    serverFeil: string;
}

export function Aktivitetsmal({
    aktivitet,
    fullførAktivitet,
    serverFeil,
}: AktivitetsmalProps) {
    return (
        <div className={styles.container}>
            {serverFeil.length > 0 && (
                <Alert variant={"error"} className={styles.alert}>
                    <BodyShort>
                        Noe gikk galt med handlingen din. {serverFeil}
                    </BodyShort>
                    <BodyShort>Prøv igjen senere...</BodyShort>
                </Alert>
            )}
            <Ingress>{aktivitet.beskrivelse}</Ingress>
            <div className={styles.mål}>
                <Heading size="medium" level="4">
                    Mål
                </Heading>
                <Ingress>{aktivitet.mål}</Ingress>
            </div>
            <div className={styles.knappeContainer}>
                <DetteHarViGjort
                    aktivitet={aktivitet}
                    fullførAktivitet={fullførAktivitet}
                    serverFeil={serverFeil}
                />
            </div>
            <PortableText value={aktivitet.innhold} components={hovedinnhold} />
        </div>
    );
}
