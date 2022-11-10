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
import { useHentOrgnummer } from "../Layout/Banner/Banner";
import {
    fullførAktivitet,
    velgAktivitet,
} from "../../lib/forebyggingsplan-klient";
import { isoDato } from "../../lib/dato";

const hovedinnhold: Partial<PortableTextComponents> = {
    types: {
        seksjon: Seksjon,
    },
    block,
    marks,
};

export function Aktivitetsmal({
    aktivitet: {
        aktivitetsmalId,
        beskrivelse,
        innhold,
        mål,
        aktivitetsId,
        status,
    },
    oppdaterValgteAktiviteter,
}: {
    aktivitet: Aktivitet;
    oppdaterValgteAktiviteter: () => void;
}) {
    const { orgnr } = useHentOrgnummer();
    const {
        datepickerProps,
        inputProps,
        selectedDay: frist,
    } = UNSAFE_useDatepicker({});
    console.log({ datepickerProps, inputProps, frist });
    return (
        <div className={styles.container}>
            <span className={styles.knappeContainer}>
                {["IKKE_VALGT", "VALGT"].includes(status) && (
                    <Button
                        className={styles.detteHarViGjortKnapp}
                        variant="secondary"
                        onClick={() => {
                            orgnr &&
                                aktivitetsmalId &&
                                fullførAktivitet({
                                    aktivitetsId: aktivitetsId,
                                    aktivitetsmalId: aktivitetsmalId,
                                    orgnr: orgnr,
                                }).then(oppdaterValgteAktiviteter);
                        }}
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
                                orgnr &&
                                    velgAktivitet({
                                        aktivitetsmalId: aktivitetsmalId,
                                        frist: isoDato(frist),
                                        orgnr: orgnr,
                                    }).then(oppdaterValgteAktiviteter);
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
