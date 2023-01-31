import { PortableText, PortableTextComponents } from "@portabletext/react";
import { useState } from "react";
import {
    Alert,
    BodyShort,
    Button,
    Heading,
    Ingress,
    Modal,
    Tag,
} from "@navikt/ds-react";
import styles from "./Aktivitetsmal.module.css";
import { Seksjon } from "../../Seksjon/Seksjon";
import { Oppgave } from "../../Oppgave/Oppgave";
import { block } from "../../PortableText/block/Block";
import { marks } from "../../PortableText/marks/Marks";
import { Aktivitet } from "../../../types/Aktivitet";
import { norskDatoformat } from "../../../lib/dato";
import { DatoVelger } from "./DatoVelger/DatoVelger";
import { DetteHarViGjort } from "./DetteHarViGjort/DetteHarViGjort";

const hovedinnhold: Partial<PortableTextComponents> = {
    types: {
        seksjon: Seksjon,
        oppgave: Oppgave,
    },
    block,
    marks,
};

interface EndreFristProps {
    aktivitet: Aktivitet;
    endreFristHandler: (stoppSpinner?: () => void, frist?: Date) => void;
}

const EndreFrist = ({ aktivitet, endreFristHandler }: EndreFristProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const frist = aktivitet.frist;

    if (aktivitet.status === "IKKE_VALGT" || aktivitet.status === "FULLFØRT")
        return null;

    return (
        <div>
            {frist && (
                <Tag variant={"neutral"}>
                    Aktiviteten har frist{" "}
                    {norskDatoformat.format(new Date(frist))}
                </Tag>
            )}
            {!frist && (
                <Tag variant={"neutral"}>Aktiviteten har ingen frist</Tag>
            )}
            <Button
                variant="tertiary"
                className={`${styles.knappMedSentrertLoader} ${styles.endreFristKnapp}`}
                onClick={() => setModalOpen(true)}
            >
                Endre frist
            </Button>
            <EndreFristModal
                aktivitet={aktivitet}
                open={modalOpen}
                setModalOpen={setModalOpen}
                endreFristHandler={endreFristHandler}
            />
        </div>
    );
};

interface EndreFristModalProps {
    aktivitet: Aktivitet;
    open: boolean;
    setModalOpen: (open: boolean) => void;
    endreFristHandler: () => void;
}

const EndreFristModal = ({
    aktivitet,
    open,
    setModalOpen,
    endreFristHandler,
}: EndreFristModalProps) => {
    const gammelDato = aktivitet.frist ? new Date(aktivitet.frist) : undefined;

    return (
        <Modal
            open={open}
            aria-label="Endre frist"
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-heading"
        >
            <Modal.Content className={styles.endreFristModal}>
                <Heading spacing level="1" size="large" id="modal-heading">
                    Endre frist
                </Heading>
                <Heading spacing level="2" size="medium">
                    {aktivitet.tittel}
                </Heading>
                <DatoVelger
                    gammelDato={gammelDato}
                    erSynlig={true}
                    bekreftelsestekst={"Lagre"}
                    datoCallback={endreFristHandler}
                    setModalOpen={setModalOpen}
                />
            </Modal.Content>
        </Modal>
    );
};

interface AktivitetsmalProps {
    aktivitet: Aktivitet;
    velgAktivitet: (stoppSpinner?: () => void, frist?: Date) => void;
    endreFristHandler: (stoppSpinner?: () => void, frist?: Date) => void;
    fullførAktivitet: () => void;
    serverFeil: string;
}

export function Aktivitetsmal({
    aktivitet,
    velgAktivitet,
    endreFristHandler,
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
            <div className={styles.knappeContainer}>
                <EndreFrist
                    aktivitet={aktivitet}
                    endreFristHandler={endreFristHandler}
                />
                <DatoVelger
                    erSynlig={aktivitet.status === "IKKE_VALGT"}
                    datoCallback={velgAktivitet}
                    bekreftelsestekst={"Dette vil vi gjøre"}
                    serverFeil={serverFeil}
                />
                <DetteHarViGjort
                    aktivitet={aktivitet}
                    fullførAktivitet={fullførAktivitet}
                    serverFeil={serverFeil}
                />
            </div>
            <Ingress>{aktivitet.beskrivelse}</Ingress>
            <div className={styles.mål}>
                <Heading size="medium" level="4">
                    Mål
                </Heading>
                <Ingress>{aktivitet.mål}</Ingress>
            </div>
            <PortableText value={aktivitet.innhold} components={hovedinnhold} />
        </div>
    );
}
