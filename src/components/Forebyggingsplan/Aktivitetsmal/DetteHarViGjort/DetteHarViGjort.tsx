import { Aktivitet } from "../../../../types/Aktivitet";
import { useState } from "react";
import { useHentOrgnummer } from "../../../Layout/Banner/Banner";
import { useHentValgteAktiviteter } from "../../../../lib/forebyggingsplan-klient";
import { Button, Loader } from "@navikt/ds-react";
import styles from "./DetteHarViGjort.module.css";

export interface DetteHarViGjortProps {
    aktivitet: Aktivitet;
    fullførAktivitet: () => void;
    serverFeil?: string;
}

export const DetteHarViGjort = ({
    aktivitet,
    fullførAktivitet,
    serverFeil,
}: DetteHarViGjortProps) => {
    const [venter, setVenter] = useState<boolean>();
    const laster = venter && !serverFeil;
    const { orgnr } = useHentOrgnummer();
    const { error } = useHentValgteAktiviteter(orgnr);
    const harForebyggeFraværRettighet = error === undefined; //alt har gått bra
    const visDetteHarViGjortKnapp =
        ["IKKE_VALGT", "VALGT"].includes(aktivitet.status) ||
        !harForebyggeFraværRettighet;
    const detteHarViGjortKnappAktivert = !laster && harForebyggeFraværRettighet;

    if (!orgnr) return null; // Ingen grunn til å vise knapper dersom vi ikke vet orgnr

    const knappStyleHvisIkkeValgtAktivitet = ["IKKE_VALGT"].includes(
        aktivitet.status
    )
        ? styles.detteHarViGjortKnapp
        : undefined;

    return (
        <>
            {visDetteHarViGjortKnapp && (
                <Button
                    className={`${styles.knappMedSentrertLoader} ${knappStyleHvisIkkeValgtAktivitet}`}
                    variant={
                        aktivitet.status == "VALGT" ? "primary" : "secondary"
                    }
                    disabled={!detteHarViGjortKnappAktivert}
                    onClick={() => {
                        setVenter(true);
                        fullførAktivitet();
                    }}
                >
                    Dette har vi gjort
                    {laster && <Loader size="xsmall" />}
                </Button>
            )}
        </>
    );
};
