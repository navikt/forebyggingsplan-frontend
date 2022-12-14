import { BodyShort, Button } from "@navikt/ds-react";
import { useRouter } from "next/router";
import styles from "./feilsider.module.css";

export default function Error() {
    const router = useRouter();
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1>Siden virker ikke akkurat nå</h1>
                <BodyShort className={styles.body}>
                    Mens vi finner ut av det kan du gå tilbake dit du var her:
                </BodyShort>
                <Button onClick={() => router.back()}>Gå tilbake</Button>
            </main>
        </div>
    );
}
