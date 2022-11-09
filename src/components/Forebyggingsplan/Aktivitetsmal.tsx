import { Aktivitet } from "../../types/Aktivitet";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import {Button, Heading, UNSAFE_DatePicker, UNSAFE_useDatepicker} from "@navikt/ds-react";

import styles from "./Aktivitetsmal.module.css";
import { Seksjon } from "../Seksjon/Seksjon";
import { block } from "../PortableText/block/Block";
import { marks } from "../PortableText/marks/Marks";
import { useHentOrgnummer } from "../Layout/Banner/Banner";
import {fullførAktivitet, velgAktivitet} from "../../lib/forebyggingsplan-klient";
import {useState} from "react";

const hovedinnhold: Partial<PortableTextComponents> = {
    types: {
        seksjon: Seksjon,
    },
    block,
    marks,
};

export function Aktivitetsmal({
    aktivitet: { aktivitetsmalId, beskrivelse, innhold, mål, aktivitetsId, status },
    oppdaterValgteAktiviteter
}: {
    aktivitet: Aktivitet,
    oppdaterValgteAktiviteter: () => void
}) {
    const [frist, setFrist] = useState<Date | undefined>()
    const { orgnr } = useHentOrgnummer();
    const { datepickerProps, inputProps, selectedDay } = UNSAFE_useDatepicker({
        fromDate: new Date("Aug 23 2019"),
        onDateChange: (dato) => setFrist(dato),
    });
    return (
        <div className={styles.container}>
            <span className={styles.knappeContainer}>
                {["IKKE_VALGT", "VALGT"].includes(status) && (
                    <Button
                        className={styles.detteHarViGjortKnapp}
                        variant="secondary"
                        onClick={() => {
                            // if (!orgnr) { setErrorstate("orgnummer mangler") }
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
                            <UNSAFE_DatePicker.Input {...inputProps} label="Velg dato" />
                        </UNSAFE_DatePicker>

                        <Button
                            onClick={() => {
                                // if (!orgnr) { setErrorstate("orgnummer mangler") }
                                orgnr &&
                                    velgAktivitet({
                                        aktivitetsmalId: aktivitetsmalId,
                                        frist: frist,
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
