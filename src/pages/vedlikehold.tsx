import { BodyLong } from "@navikt/ds-react";
import styles from "./feilsider.module.css";

export default function Vedlikehold() {
    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <h1>Denne siden er ikke tilgjengelig for øyeblikket</h1>
                <BodyLong className={styles.body}>
                    Vi jobber med å gjøre denne siden bedre. Vennligst prøv
                    igjen senere.
                </BodyLong>
            </div>
        </div>
    );
}
