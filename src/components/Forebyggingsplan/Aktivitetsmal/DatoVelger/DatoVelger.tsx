import { useState } from "react";
import {
    Button,
    Loader,
    UNSAFE_DatePicker,
    UNSAFE_useDatepicker,
} from "@navikt/ds-react";
import { useHentOrgnummer } from "../../../Layout/Banner/Banner";
import { useHentValgteAktiviteter } from "../../../../lib/forebyggingsplan-klient";
import styles from "./DatoVelger.module.css";

interface DatoVelgerProps {
    erSynlig: boolean;
    gammelDato?: Date | undefined;
    bekreftelsestekst: string;
    datoCallback: (stoppSpinner?: () => void, frist?: Date) => void;
    serverFeil?: string;
}

export const DatoVelger = ({
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

    const stoppSpinner = () => {
        setVenter(false);
    };

    return (
        <div className={styles.datoVelgerContainer}>
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
                    datoCallback(stoppSpinner, frist);
                }}
                disabled={ugyldig || forTidlig || laster}
            >
                {bekreftelsestekst}
                {laster && <Loader size={"xsmall"} />}
            </Button>
        </div>
    );
};
