import React from "react";
import styles from "./Oppgave.module.css";
import { Tag } from "@navikt/ds-react";
import { statusType } from "./Oppgave";

export function Statusvisning({ status }: { status: statusType }) {
    switch (status) {
        case "urørt":
            return null;
        case "under_arbeid":
            return (
                <Tag className={styles.status} variant="warning">
                    Under arbeid
                </Tag>
            );
        case "fullført":
            return (
                <Tag className={styles.status} variant="success">
                    Fullført
                </Tag>
            );
    }
}
