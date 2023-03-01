import { Alert, BodyShort, Heading } from "@navikt/ds-react";
import styles from "./TestVersjonBanner.module.css";
const TestVersjonBanner = () => {
    return (
        <Alert variant="warning" size="medium" className={styles.alert}>
            <Heading spacing size="small">
                Dette er en testversjon
            </Heading>
            <BodyShort>
                Her kan du bli bedre kjent med siden Slik forebygger dere
                sykefravær
            </BodyShort>
        </Alert>
    );
};

export default TestVersjonBanner;
