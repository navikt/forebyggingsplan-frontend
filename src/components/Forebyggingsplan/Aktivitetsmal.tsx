import { Aktivitet } from "../../types/Aktivitet";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import {
    Button,
    Heading,
    UNSAFE_DatePicker,
    UNSAFE_useDatepicker,
} from "@navikt/ds-react";

import styles from "./Aktivitetsmal.module.css";
import { Seksjon } from "../Seksjon/Seksjon";
import { block } from "../PortableText/block/Block";
import { marks } from "../PortableText/marks/Marks";

const hovedinnhold: Partial<PortableTextComponents> = {
    types: {
        seksjon: Seksjon,
    },
    block,
    marks,
};

export function Aktivitetsmal({
    aktivitet: { beskrivelse, innhold, mål, status },
    velgAktivitet,
    fullførAktivitet,
}: {
    aktivitet: Aktivitet;
    velgAktivitet: (frist?: Date) => void;
    fullførAktivitet: () => void;
}) {
    const {
        datepickerProps,
        inputProps,
        selectedDay: frist,
    } = UNSAFE_useDatepicker();
    return (
        <div className={styles.container}>
            <span className={styles.knappeContainer}>
                {["IKKE_VALGT", "VALGT"].includes(status) && (
                    <Button
                        className={styles.detteHarViGjortKnapp}
                        variant="secondary"
                        onClick={fullførAktivitet}
                    >
                        {status === "VALGT"
                            ? "Ferdig"
                            : "Dette har vi på plass"}
                    </Button>
                )}
                {status === "IKKE_VALGT" && (
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
            {beskrivelse}
            <Heading size="medium" level="3">
                Mål
            </Heading>
            {mål}

            <PortableText value={innhold} components={hovedinnhold} />
        </div>
    );
}
