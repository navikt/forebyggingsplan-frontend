import { Aktivitet } from "../../types/Aktivitet";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import {
    Button,
    Heading,
    Ingress,
    UNSAFE_DatePicker,
    UNSAFE_useDatepicker,
} from "@navikt/ds-react";

import styles from "./Aktivitetsmal.module.css";
import { Seksjon } from "../Seksjon/Seksjon";
import { block } from "../PortableText/block/Block";
import { marks } from "../PortableText/marks/Marks";
import { EksporterTilKalender } from "./EksporterTilKalender";
import { useHentOrgnummer } from "../Layout/Banner/Banner";

const hovedinnhold: Partial<PortableTextComponents> = {
    types: {
        seksjon: Seksjon,
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
    const {
        datepickerProps,
        inputProps,
        selectedDay: frist,
    } = UNSAFE_useDatepicker();
    const { orgnr } = useHentOrgnummer();
    if (!orgnr) return null; // Ingen grunn til å vise knapper dersom vi ikke vet orgnr

    return (
        <div className={styles.knappeContainer}>
            {aktivitet.status === "IKKE_VALGT" && (
                <div className={styles.detteVilViGjøreContainer}>
                    <UNSAFE_DatePicker
                        {...datepickerProps}
                        fromDate={new Date()}
                    >
                        <UNSAFE_DatePicker.Input
                            {...inputProps}
                            label="Frist"
                        />
                    </UNSAFE_DatePicker>

                    <Button
                        onClick={() => {
                            velgAktivitet(frist);
                        }}
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

export function Aktivitetsmal({
    aktivitet,
    velgAktivitet,
    fullførAktivitet,
}: Props) {
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
