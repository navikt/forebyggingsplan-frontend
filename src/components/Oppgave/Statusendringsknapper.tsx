import React from "react";
import styles from "./Oppgave.module.css";
import { Button } from "@navikt/ds-react";
import { ArrowCirclepathIcon } from "@navikt/aksel-icons";
import { statuser } from "./Oppgave";

export function Statusendringsknapper({
    status,
    setNyStatus,
}: {
    status: statuser;
    setNyStatus: (nyStatus: statuser) => void;
}) {
    switch (status) {
        case "urørt":
            return (
                <Button
                    size="small"
                    variant="secondary"
                    onClick={() => setNyStatus("under_arbeid")}
                >
                    Start
                </Button>
            );
        case "under_arbeid":
            return (
                <div className="flex flex-wrap gap-2">
                    <Button
                        size="small"
                        variant="secondary"
                        onClick={() => setNyStatus("fullført")}
                    >
                        Fullfør
                    </Button>
                    <Button
                        size="small"
                        variant="secondary-neutral"
                        className={styles.avbryt}
                        onClick={() => setNyStatus("urørt")}
                    >
                        Avbryt
                    </Button>
                </div>
            );
        case "fullført":
            return (
                <Button
                    size="small"
                    variant="secondary-neutral"
                    onClick={() => setNyStatus("urørt")}
                    icon={<ArrowCirclepathIcon />}
                >
                    Start på nytt
                </Button>
            );
    }
}
