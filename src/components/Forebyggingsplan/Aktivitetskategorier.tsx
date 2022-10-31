import { Accordion, BodyShort, Heading } from "@navikt/ds-react";
import { Aktivitetsrad } from "./Aktivitetsrad";
import { Kategori } from "../../types/kategori";
import styles from "./Aktivitetskategorier.module.css";

interface Props {
    kategorier: Kategori[];
}

export const Aktivitetskategorier = ({ kategorier }: Props) => {
    return (
        <div data-theme="light" className={styles.aktivitetskategorier}>
            {kategorier.map(({aktiviteter, tittel, beskrivelse}) => {
                return (
                    <article key={tittel} className={styles.kategori}>
                        <Heading size="large">{tittel}</Heading>
                        <BodyShort>{beskrivelse}</BodyShort>
                        <Accordion className={styles.accordion}>
                            {aktiviteter.map((aktivitet) => {
                                return (
                                    <Aktivitetsrad
                                        key={aktivitet.tittel}
                                        aktivitet={aktivitet}
                                    />
                                );
                            })}
                        </Accordion>
                    </article>
                );
            })}
        </div>
    );
};
