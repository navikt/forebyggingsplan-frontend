import { PortableText, PortableTextComponents } from "@portabletext/react";
import { useState } from "react";
import {
    Alert,
    BodyShort,
    Button,
    Heading,
    Ingress,
    Loader,
    Modal,
    Tag,
} from "@navikt/ds-react";
import styles from "./Aktivitetsmal.module.css";
import { Seksjon } from "../../Seksjon/Seksjon";
import { Oppgave } from "../../Oppgave/Oppgave";
import { block } from "../../PortableText/block/Block";
import { marks } from "../../PortableText/marks/Marks";
import { EksporterTilKalender } from "../EksporterTilKalender";
import { useHentOrgnummer } from "../../Layout/Banner/Banner";
import { Aktivitet } from "../../../types/Aktivitet";
import { useHentValgteAktiviteter } from "../../../lib/forebyggingsplan-klient";
import { norskDatoformat } from "../../../lib/dato";
import { DatoVelger } from "./DatoVelger/DatoVelger";

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
    const [open, setOpen] = useState(false);
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
                onClick={() => setOpen(true)}
            >
                Endre frist
            </Button>
            <EndreFristModal
                aktivitet={aktivitet}
                open={open}
                setOpen={setOpen}
                endreFristHandler={endreFristHandler}
            />
        </div>
    );
};

interface EndreFristModalProps {
    aktivitet: Aktivitet;
    open: boolean;
    setOpen: (open: boolean) => void;
    endreFristHandler: () => void;
}

const EndreFristModal = ({
    aktivitet,
    open,
    setOpen,
    endreFristHandler,
}: EndreFristModalProps) => {
    const gammelDato = aktivitet.frist ? new Date(aktivitet.frist) : undefined;

    return (
        <Modal
            open={open}
            aria-label="Endre frist"
            onClose={() => setOpen(false)}
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
                />
            </Modal.Content>
        </Modal>
    );
};

interface DetteHarViGjortProps {
    aktivitet: Aktivitet;
    fullførAktivitet: () => void;
    serverFeil?: string;
}

const DetteHarViGjort = ({
    aktivitet,
    fullførAktivitet,
    serverFeil,
}: DetteHarViGjortProps) => {
    const [venter, setVenter] = useState<boolean>();
    const laster = venter && !serverFeil;
    const { orgnr } = useHentOrgnummer();
    const { error } = useHentValgteAktiviteter(orgnr);

    if (!orgnr || error) return null; // Ingen grunn til å vise knapper dersom vi ikke vet orgnr

    return (
        <>
            {["IKKE_VALGT", "VALGT"].includes(aktivitet.status) && (
                <Button
                    className={`${styles.detteHarViGjortKnapp} ${styles.knappMedSentrertLoader}`}
                    variant={
                        aktivitet.status == "VALGT" ? "primary" : "secondary"
                    }
                    disabled={laster}
                    onClick={() => {
                        setVenter(true);
                        fullførAktivitet();
                    }}
                >
                    Dette har vi gjort
                    {laster && <Loader size="xsmall" />}
                </Button>
            )}
            <EksporterTilKalender aktivitet={aktivitet} />
        </>
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
