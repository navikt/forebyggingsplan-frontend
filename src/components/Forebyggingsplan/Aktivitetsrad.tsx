import { Accordion, Heading } from "@navikt/ds-react";
import { useHentOrgnummer } from "../Layout/Banner/Banner";
import { loggÅpneAktivitet } from "../../lib/klient/amplitude-klient";
import { lagreIaMetrikkInformasjonstjeneste } from "../../lib/klient/ia-metrikker-klient";
import { Aktivitet } from "../../types/Aktivitet";
import { useCallback, useRef, useState } from "react";
import { AktivitetHeader } from "./AktivitetHeader";
import { Aktivitetsmal } from "./Aktivitetsmal/Aktivitetsmal";
import {
    AktivitetStatistikkType,
    useAktivitetStatistikk,
} from "./useAktivitetStatistikk";
import styles from "./Aktivitetsrad.module.css";

interface Props {
    aktivitet: Aktivitet;
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

    const aktivitetStatistikk = useAktivitetStatistikk(aktivitet);

    return (
        <Accordion.Item
            open={åpen}
            className={styles.accordionItem}
            ref={radRef}
        >
            <Accordion.Header
                onClick={onClick}
                className={`${getAktivitetHeaderFarge(aktivitetStatistikk)} ${
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
                        aktivitetStatistikk={aktivitetStatistikk}
                    />
                </Heading>
            </Accordion.Header>
            <Accordion.Content
                data-aktivitetsmalid={aktivitet.aktivitetsmalId}
                className={styles.accordionContent}
            >
                <Aktivitetsmal
                    aktivitetStatistikk={aktivitetStatistikk}
                    aktivitet={aktivitet}
                />
            </Accordion.Content>
        </Accordion.Item>
    );
};

function getAktivitetHeaderFarge(aktivitetStatistikk: AktivitetStatistikkType) {
    if (aktivitetStatistikk.totalt === 0) {
        return styles.aktivitetIkkeValgt;
    }
    if (aktivitetStatistikk.ferdige === aktivitetStatistikk.totalt) {
        return styles.aktivitetFullført;
    }

    return styles.aktivitetIkkeValgt;
}
