import React from "react";
import styles from "./Oppgave.module.css";
import { Button } from "@navikt/ds-react";
import {
    ArrowCirclepathIcon,
    CheckmarkIcon,
    ChevronDownIcon,
    XMarkIcon,
} from "@navikt/aksel-icons";
import { StatusType } from "./Oppgave";

export function Statusendringsknapper({
    status,
    setNyStatus,
}: {
    status?: StatusType;
    setNyStatus: (nyStatus: StatusType) => void;
}) {
    switch (status) {
        case "AVBRUTT":
        case undefined:
            return (
                <Button
                    variant="secondary"
                    className={`${styles.statusknapp} ${styles.helknapp}`}
                    onClick={() => {
                        setNyStatus("STARTET");
                    }}
                    icon={<ChevronDownIcon title="Start" />}
                >
                    Start
                </Button>
            );
        case "STARTET":
            return (
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="secondary"
                        className={`${styles.statusknapp} ${styles.halvknapp}`}
                        onClick={() => {
                            setNyStatus("FULLFØRT");
                        }}
                        icon={<CheckmarkIcon title="Fullfør" />}
                    >
                        Fullfør
                    </Button>
                    <Button
                        variant="secondary-neutral"
                        className={`${styles.statusknapp} ${styles.halvknapp}`}
                        onClick={() => {
                            setNyStatus("AVBRUTT");
                        }}
                        icon={<XMarkIcon title="Avbryt" />}
                    >
                        Avbryt
                    </Button>
                </div>
            );
        case "FULLFØRT":
            return (
                <Button
                    variant="secondary-neutral"
                    className={`${styles.statusknapp} ${styles.helknapp}`}
                    onClick={() => {
                        setNyStatus("AVBRUTT");
                    }}
                    icon={<ArrowCirclepathIcon title="Start på nytt" />}
                >
                    Start på nytt
                </Button>
            );
        default:
            return null;
    }
}
