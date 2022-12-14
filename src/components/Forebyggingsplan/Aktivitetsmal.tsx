import { PortableText, PortableTextComponents } from "@portabletext/react";
import { useState } from "react";
import { Button, Heading, Ingress, UNSAFE_DatePicker, UNSAFE_useDatepicker, } from "@navikt/ds-react";
import styles from "./Aktivitetsmal.module.css";
import { Seksjon } from "../Seksjon/Seksjon";
import { Oppgave } from "../Oppgave/Oppgave";
import { block } from "../PortableText/block/Block";
import { marks } from "../PortableText/marks/Marks";
import { EksporterTilKalender } from "./EksporterTilKalender";
import { useHentOrgnummer } from "../Layout/Banner/Banner";
import { Aktivitet } from "../../types/Aktivitet";

const hovedinnhold: Partial<PortableTextComponents> = {
    types: {
        seksjon: Seksjon,
        oppgave: Oppgave,
    },
    block,
    marks,
};

interface Props {
    aktivitet: Aktivitet;
    velgAktivitet: (frist?: Date) => void;
    fullførAktivitet: () => void;
}

const Handlinger = ({ aktivitet, fullførAktivitet, velgAktivitet }: Props) => {
    const [forTidlig, setForTidlig] = useState<boolean>();
    const [ugyldig, setUgyldig] = useState<boolean>();
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

    if (!orgnr) return null; // Ingen grunn til å vise knapper dersom vi ikke vet orgnr

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
                        onClick={() => {
                            velgAktivitet(frist);
                        }}
                        disabled={ugyldig || forTidlig}
                    >
                        Dette vil vi gjøre
                    </Button>
                </div>
            )}
            {["IKKE_VALGT", "VALGT"].includes(aktivitet.status) && (
                <Button
                    className={styles.detteHarViGjortKnapp}
                    variant={
                        aktivitet.status == "VALGT" ? "primary" : "secondary"
                    }
                    onClick={fullførAktivitet}
                >
                    Dette har vi gjort
                </Button>
            )}
            <EksporterTilKalender aktivitet={aktivitet} />
        </div>
    );
};

export function Aktivitetsmal({ aktivitet, velgAktivitet, fullførAktivitet }: Props) {
    return (
        <div className={styles.container}>
            <Handlinger
                aktivitet={aktivitet}
                velgAktivitet={velgAktivitet}
                fullførAktivitet={fullførAktivitet}
            />
            <Ingress>{aktivitet.beskrivelse}</Ingress>
            <Heading size="medium" level="4">
                Mål
            </Heading>
            <Ingress>{aktivitet.mål}</Ingress>
            <PortableText value={aktivitet.innhold} components={hovedinnhold} />
        </div>
    );
}
