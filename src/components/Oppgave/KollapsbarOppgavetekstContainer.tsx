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
    const kollapset = erKollapsetType(status);
    return (
        <div
            className={
                kollapset
                    ? styles.kollapsetOppgavetekst
                    : styles.synligOppgavetekst
            }
        >
            <span aria-hidden="true">{children}</span>
            <div className={styles.oppgavetekstOverlayGradient}>{knapper}</div>
        </div>
    );
}
