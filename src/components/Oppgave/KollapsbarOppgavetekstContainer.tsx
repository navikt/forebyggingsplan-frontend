import React from "react";
import styles from "./Oppgave.module.css";
import { statusType } from "./Oppgave";

function erKollapsetType(status: statusType): boolean {
    return status === "urørt" || status === "fullført";
}
export function KollapsbarOppgavetekstContainer({
    children,
    knapper,
    status,
}: {
    children: React.ReactNode;
    knapper: React.ReactNode;
    status: statusType;
}) {
    return (
        <div
            className={
                erKollapsetType(status)
                    ? styles.kollapsetOppgavetekst
                    : styles.synligOppgavetekst
            }
        >
            {children}
            <div className={styles.oppgavetekstOverlayGradient}>{knapper}</div>
        </div>
    );
}
