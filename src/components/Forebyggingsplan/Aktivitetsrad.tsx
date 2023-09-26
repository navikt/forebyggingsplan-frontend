import { Aktivitet, AktivitetStatus } from "../../types/Aktivitet";
import { Accordion, Heading } from "@navikt/ds-react";
import styles from "./Aktivitetsrad.module.css";
import { useHentOrgnummer } from "../Layout/Banner/Banner";
import { loggÅpneAktivitet } from "../../lib/amplitude-klient";
import { useCallback, useRef, useState } from "react";
import { AktivitetHeader } from "./AktivitetHeader";
import { lagreIaMetrikkInformasjonstjeneste } from "../../lib/ia-metrikker-klient";
import { Aktivitetsmal } from "./Aktivitetsmal/Aktivitetsmal";

interface Props {
    aktivitet: Aktivitet;
    oppdaterValgteAktiviteter: () => void;
}

export const Aktivitetsrad = ({ aktivitet }: Props) => {
    const radRef = useRef<HTMLDivElement>(null);
    const [åpen, setÅpen] = useState<boolean>(false);
    const { orgnr } = useHentOrgnummer();

    const onClick = useCallback(() => {
        if (åpen) {
            setÅpen(false);
        } else {
            setÅpen(true);

            loggÅpneAktivitet(aktivitet);
            lagreIaMetrikkInformasjonstjeneste(orgnr);

            radRef?.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [åpen, aktivitet, orgnr, radRef]);

    if (åpen) {
        console.log("aktivitet :>> ", aktivitet);
    }

    const max = Math.round(Math.random() * 10);
    const value = Math.round(Math.random() * max);
    const inProgress = Math.round(Math.random() * (max - value));

    return (
        <Accordion.Item
            open={åpen}
            className={styles.accordionItem}
            ref={radRef}
        >
            <Accordion.Header
                onClick={onClick}
                className={`${AktivitetStatusStyle[aktivitet.status]} ${
                    styles.accordionHeader
                }`}
            >
                <Heading
                    size="medium"
                    level="3"
                    className={`${styles.sticky} ${styles.heading}`}
                >
                    <AktivitetHeader
                        aktivitet={aktivitet}
                        max={max}
                        value={value}
                        inProgress={inProgress}
                    />
                </Heading>
            </Accordion.Header>
            <Accordion.Content
                data-aktivitetsmalid={aktivitet.aktivitetsmalId}
                className={styles.content}
            >
                <Aktivitetsmal
                    max={max}
                    value={value}
                    inProgress={inProgress}
                    aktivitet={aktivitet}
                />
            </Accordion.Content>
        </Accordion.Item>
    );
};

const AktivitetStatusStyle: { [key in AktivitetStatus]: string } = {
    IKKE_VALGT: styles.aktivitetIkkeValgt,
    VALGT: styles.aktivitetValgt,
    FULLFØRT: styles.aktivitetFullført,
};
