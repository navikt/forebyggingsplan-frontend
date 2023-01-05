import { PortableText, PortableTextComponents } from "@portabletext/react";
import { useState } from "react";
import {
    Alert,
    BodyShort,
    Button,
    Heading,
    Ingress,
    Loader,
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

const hovedinnhold: Partial<PortableTextComponents> = {
    types: {
        seksjon: Seksjon,
        oppgave: Oppgave,
    },
    block,
    marks,
};

interface DetteVilViGjøreProps {
    aktivitet: Aktivitet;
    velgAktivitet: (frist?: Date) => void;
}

const DetteVilViGjøre = ({
    aktivitet,
    velgAktivitet,
}: DetteVilViGjøreProps) => {
    const [forTidlig, setForTidlig] = useState<boolean>();
    const [ugyldig, setUgyldig] = useState<boolean>();
    const [laster, setLaster] = useState<boolean>(false);
    const {
        datepickerProps,
        inputProps,
        selectedDay: frist,
    } = UNSAFE_useDatepicker({
        fromDate: new Date(),
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

    if (!orgnr || error) return null; // Ingen grunn til å vise knapper dersom vi ikke vet orgnr

    return (
        <div className={styles.knappeContainer}>
            {aktivitet.status === "IKKE_VALGT" && (
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
                            setLaster(true);
                            velgAktivitet(frist);
                        }}
                        disabled={ugyldig || forTidlig || laster}
                    >
                        Dette vil vi gjøre
                        {laster && <Loader size={"xsmall"} />}
                    </Button>
                </div>
            )}
        </div>
    );
};

interface DetteHarViGjortProps {
    aktivitet: Aktivitet;
    fullførAktivitet: () => void;
}

const DetteHarViGjort = ({
    aktivitet,
    fullførAktivitet,
}: DetteHarViGjortProps) => {
    const [laster, setLaster] = useState<boolean>(false);
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
                        setLaster(true);
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
    fullførAktivitet: () => void;
    serverFeil: string;
}

export function Aktivitetsmal({
    aktivitet,
    velgAktivitet,
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
                <DetteVilViGjøre
                    aktivitet={aktivitet}
                    velgAktivitet={velgAktivitet}
                />
                <DetteHarViGjort
                    aktivitet={aktivitet}
                    fullførAktivitet={fullførAktivitet}
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
