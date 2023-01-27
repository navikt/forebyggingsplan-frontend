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
    UNSAFE_DatePicker,
    UNSAFE_useDatepicker,
} from "@navikt/ds-react";
import styles from "./Aktivitetsmal.module.css";
import { Seksjon } from "../Seksjon/Seksjon";
import { Oppgave } from "../Oppgave/Oppgave";
import { block } from "../PortableText/block/Block";
import { marks } from "../PortableText/marks/Marks";
import { EksporterTilKalender } from "./EksporterTilKalender";
import { useHentOrgnummer } from "../Layout/Banner/Banner";
import { Aktivitet } from "../../types/Aktivitet";
import { useHentValgteAktiviteter } from "../../lib/forebyggingsplan-klient";
import { norskDatoformat } from "../../lib/dato";

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
    endreFristHandler: (frist?: Date) => void;
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

interface DatoVelgerProps {
    erSynlig: boolean;
    gammelDato?: Date | undefined;
    bekreftelsestekst: string;
    datoCallback: (frist?: Date) => void;
    serverFeil?: string;
}

const DatoVelger = ({
    erSynlig,
    gammelDato,
    bekreftelsestekst,
    datoCallback,
    serverFeil,
}: DatoVelgerProps) => {
    const [forTidlig, setForTidlig] = useState<boolean>();
    const [ugyldig, setUgyldig] = useState<boolean>();
    const [venter, setVenter] = useState<boolean>();
    const laster = venter && !serverFeil;

    const {
        datepickerProps,
        inputProps,
        selectedDay: frist,
    } = UNSAFE_useDatepicker({
        fromDate: new Date(),
        defaultSelected: gammelDato,
        onValidate: (val) => {
            if (val.isBefore) setForTidlig(true);
            else setForTidlig(false);
            if (val.isEmpty) {
                setUgyldig(false);
            } else {
                if (val.isWeekend === undefined) setUgyldig(true);
                else setUgyldig(false);
            }
        },
    });
    const { orgnr } = useHentOrgnummer();
    const { error } = useHentValgteAktiviteter(orgnr);

    if (!orgnr || error || !erSynlig) return null; // Ingen grunn til å vise knapper dersom vi ikke vet orgnr

    return (
        <div className={styles.knappeContainer}>
            <div className={styles.detteVilViGjøreContainer}>
                <UNSAFE_DatePicker {...datepickerProps}>
                    <UNSAFE_DatePicker.Input
                        {...inputProps}
                        label="Frist"
                        error={
                            (ugyldig &&
                                "Dette er ikke en gyldig dato. Gyldig format er DD.MM.ÅÅÅÅ") ||
                            (forTidlig && "Frist kan tidligst være idag")
                        }
                    />
                </UNSAFE_DatePicker>

                <Button
                    className={styles.knappMedSentrertLoader}
                    onClick={() => {
                        setVenter(true);
                        datoCallback(frist);
                    }}
                    disabled={ugyldig || forTidlig || laster}
                >
                    {bekreftelsestekst}
                    {laster && <Loader size={"xsmall"} />}
                </Button>
            </div>
        </div>
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
    velgAktivitet: (frist?: Date) => void;
    endreFristHandler: (frist?: Date) => void;
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
