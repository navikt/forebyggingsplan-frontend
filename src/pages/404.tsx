import { BodyLong, Button } from "@navikt/ds-react";
import { useRouter } from "next/router";
import styles from "./feilsider.module.css";

export default function Custom404() {
    const router = useRouter();
    return (
        <div className={styles.container}>
            <div
                className={styles.main}
                id="maincontent"
                role="main"
                tabIndex={-1}
            >
                <h1>Denne siden finner vi ikke likevel</h1>
                <BodyLong className={styles.body}>
                    Det ser ut som om siden har flyttet til ny adresse uten at
                    vi har fått det med oss
                </BodyLong>
                <BodyLong className={styles.body}>
                    Mens vi finner ut av det kan du gå tilbake dit du var her:
                </BodyLong>
                <Button onClick={() => router.back()}>Gå tilbake</Button>
            </div>
        </div>
    );
}
