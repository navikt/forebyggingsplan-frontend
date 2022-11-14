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
import { lastNedFil } from "../../lib/filer";

const hovedinnhold: Partial<PortableTextComponents> = {
    types: {
        seksjon: Seksjon,
    },
    block,
    marks,
};

const lagKalenderInvitasjon = ({
    tittel,
    frist,
    aktivitetsmalId,
    aktivitetsId,
}: Aktivitet) => {
    return fetch("/api/kalender", {
        method: "POST",
        body: JSON.stringify({ tittel, frist, aktivitetsmalId, aktivitetsId }),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res) => res.blob());
};

export function Aktivitetsmal({
    aktivitet,
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
                {aktivitet.frist && (
                    <Button
                        className={styles.detteHarViGjortKnapp}
                        variant="secondary"
                        onClick={() =>
                            lagKalenderInvitasjon(aktivitet).then((blob) => {
                                lastNedFil(blob);
                            })
                        }
                    >
                        Legg til i kalender
                    </Button>
                )}
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
            {aktivitet.beskrivelse}
            <Heading size="medium" level="3">
                Mål
            </Heading>
            {aktivitet.mål}

            <PortableText value={aktivitet.innhold} components={hovedinnhold} />
        </div>
    );
}
