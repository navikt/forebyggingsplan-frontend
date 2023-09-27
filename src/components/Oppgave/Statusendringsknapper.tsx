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
import { loggKnappetrykk } from "../../lib/klient/amplitude-klient";

export function Statusendringsknapper({
    status,
    setNyStatus,
    oppgavetittel,
}: {
    status?: StatusType;
    setNyStatus: (nyStatus: StatusType) => void;
    oppgavetittel: string;
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
                        loggKnappetrykk("Start", { oppgavetittel });
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
                            loggKnappetrykk("Fullfør", { oppgavetittel });
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
                            loggKnappetrykk("Avbryt", { oppgavetittel });
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
                        loggKnappetrykk("Tilbakestill", { oppgavetittel });
                    }}
                    icon={<ArrowCirclepathIcon title="Tilbakestill" />}
                >
                    Tilbakestill
                </Button>
            );
        default:
            return null;
    }
}
