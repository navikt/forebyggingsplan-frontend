import React from "react";
import styles from "./Oppgave.module.css";
import { Button } from "@navikt/ds-react";
import {
    ArrowCirclepathIcon,
    CheckmarkIcon,
    ChevronDownIcon,
    XMarkIcon,
} from "@navikt/aksel-icons";
import { statusType } from "./Oppgave";

export function Statusendringsknapper({
    status,
    setNyStatus,
}: {
    status: statusType;
    setNyStatus: (nyStatus: statusType) => void;
}) {
    switch (status) {
        case "urørt":
            return (
                <Button
                    variant="secondary"
                    className={`${styles.statusknapp} ${styles.helknapp}`}
                    onClick={() => setNyStatus("under_arbeid")}
                    icon={<ChevronDownIcon title="Start" />}
                >
                    Start
                </Button>
            );
        case "under_arbeid":
            return (
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="secondary"
                        className={`${styles.statusknapp} ${styles.halvknapp}`}
                        onClick={() => setNyStatus("fullført")}
                        icon={<CheckmarkIcon title="Fullfør" />}
                    >
                        Fullfør
                    </Button>
                    <Button
                        variant="secondary-neutral"
                        className={`${styles.statusknapp} ${styles.halvknapp}`}
                        onClick={() => setNyStatus("urørt")}
                        icon={<XMarkIcon title="Avbryt" />}
                    >
                        Avbryt
                    </Button>
                </div>
            );
        case "fullført":
            return (
                <Button
                    variant="secondary-neutral"
                    className={`${styles.statusknapp} ${styles.helknapp}`}
                    onClick={() => setNyStatus("urørt")}
                    icon={<ArrowCirclepathIcon title="Start på nytt" />}
                >
                    Start på nytt
                </Button>
            );
    }
}