import React from "react";
import styles from "./Oppgave.module.css";
import { Tag } from "@navikt/ds-react";
import { statuser } from "./Oppgave";

export function Statusvisning({ status }: { status: statuser }) {
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
