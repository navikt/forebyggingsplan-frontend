import { PortableText, PortableTextComponents } from "@portabletext/react";
import { useEffect, useState } from "react";
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
    endreFristHandler: (frist?: Date) => Promise<void> | undefined;
}

const EndreFrist = ({ aktivitet, endreFristHandler }: EndreFristProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const frist = aktivitet.frist;

    if (aktivitet.status === "IKKE_VALGT" || aktivitet.status === "FULLFØRT")
        return null;

    return (
        <div className={styles.endreFristContainer}>
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
                className={styles.knappMedSentrertLoader}
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
    endreFristHandler: (frist?: Date) => Promise<void> | undefined;
}

const EndreFristModal = ({
    aktivitet,
    open,
    setModalOpen,
    endreFristHandler,
}: EndreFristModalProps) => {
    const gammelDato = aktivitet.frist ? new Date(aktivitet.frist) : undefined;

    useEffect(() => {
        Modal.setAppElement("body");
    }, []);

    return (
        <Modal
            className={styles.endreFristModal}
            open={open}
            aria-label="Endre frist"
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-heading"
        >
            <Modal.Content>
                <Heading spacing level="1" size="large" id="modal-heading">
                    Endre frist
                </Heading>
                <BodyShort spacing>
                    Endre frist for aktiviteten &quot;{aktivitet.tittel}&quot;
                </BodyShort>
                <DatoVelger
                    gammelDato={gammelDato}
                    erSynlig={true}
                    bekreftelsestekst={"Lagre"}
                    setModalOpen={setModalOpen}
                    datoCallback={endreFristHandler}
                />
            </Modal.Content>
        </Modal>
    );
};

interface AktivitetsmalProps {
    aktivitet: Aktivitet;
    velgAktivitet: (frist?: Date) => Promise<void> | undefined;
    fullførAktivitet: () => void;
    serverFeil: string;
    endreFristHandler: (frist?: Date) => Promise<void> | undefined;
}

export function Aktivitetsmal({
    aktivitet,
    velgAktivitet,
    fullførAktivitet,
    serverFeil,
    endreFristHandler,
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
                    bekreftelsestekst={"Dette vil vi gjøre"}
                    serverFeil={serverFeil}
                    datoCallback={velgAktivitet}
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
