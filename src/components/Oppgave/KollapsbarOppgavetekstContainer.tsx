import React from "react";
import styles from "./Oppgave.module.css";
import { StatusType } from "./Oppgave";

function erKollapsetType(status?: StatusType): boolean {
    return (
        status === "AVBRUTT" || status === "FULLFØRT" || status === undefined
    );
}
export function KollapsbarOppgavetekstContainer({
    children,
    knapper,
    status,
}: {
    children: React.ReactNode;
    knapper: React.ReactNode;
    status?: StatusType;
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
