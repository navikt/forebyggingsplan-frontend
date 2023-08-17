import { Alert, BodyShort, Heading, Link } from "@navikt/ds-react";
import styles from "./TestVersjonBanner.module.css";
const TestVersjonBanner = ({ prodUrl }: { prodUrl?: string }) => {
    console.log("prodUrl :>> ", prodUrl);
    return (
        <Alert variant="warning" size="medium" className={styles.alert}>
            <Heading spacing level="2" size="small">
                Dette er en testversjon
            </Heading>
            <BodyShort>
                Her kan du bli bedre kjent med siden Slik forebygger dere
                sykefravær.
                {prodUrl?.length ? (
                    <>
                        <br />
                        <Link href={prodUrl}>
                            Klikk her for å gå til den vanlige siden.
                        </Link>
                    </>
                ) : null}
            </BodyShort>
        </Alert>
    );
};

export default TestVersjonBanner;
