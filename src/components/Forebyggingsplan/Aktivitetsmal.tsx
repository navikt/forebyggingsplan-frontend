import { Aktivitet } from "../../types/Aktivitet";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import {
    BodyLong,
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

    return (
        <span className={styles.knappeContainer}>
            <EksporterTilKalender aktivitet={aktivitet} />
            {["IKKE_VALGT", "VALGT"].includes(aktivitet.status) && (
                <Button
                    className={styles.detteHarViGjortKnapp}
                    variant="secondary"
                    onClick={fullførAktivitet}
                >
                    {aktivitet.status === "VALGT"
                        ? "Ferdig"
                        : "Dette har vi på plass"}
                </Button>
            )}
            {aktivitet.status === "IKKE_VALGT" && (
                <div className={styles.detteVilViGjøreContainer}>
                    <UNSAFE_DatePicker {...datepickerProps}>
                        <UNSAFE_DatePicker.Input
                            {...inputProps}
                            label="Velg dato"
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
        </span>
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
            <Heading size="medium" level="3">
                Mål
            </Heading>
            <BodyLong>{aktivitet.mål}</BodyLong>
            <PortableText value={aktivitet.innhold} components={hovedinnhold} />
            <Handlinger
                aktivitet={aktivitet}
                velgAktivitet={velgAktivitet}
                fullførAktivitet={fullførAktivitet}
            />
        </div>
    );
}
