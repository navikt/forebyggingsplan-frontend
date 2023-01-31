import { Aktivitet } from "../../../../types/Aktivitet";
import { useState } from "react";
import { useHentOrgnummer } from "../../../Layout/Banner/Banner";
import { useHentValgteAktiviteter } from "../../../../lib/forebyggingsplan-klient";
import { Button, Loader } from "@navikt/ds-react";
import styles from "./DetteHarViGjort.module.css";
import { EksporterTilKalender } from "../../EksporterTilKalender";

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
                        setVenter(true);
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
