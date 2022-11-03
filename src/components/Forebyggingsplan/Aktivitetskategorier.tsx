import { Accordion, BodyShort, Heading } from "@navikt/ds-react";
import { Aktivitetsrad } from "./Aktivitetsrad";
import { Kategori } from "../../types/kategori";
import styles from "./Aktivitetskategorier.module.css";
import { useState } from "react";
import { Aktivitet } from "../../types/Aktivitet";

interface Props {
    kategorier: Kategori[];
}

export const Aktivitetskategorier = ({ kategorier }: Props) => {
    const [aktivRad, setAktivRad] = useState<Aktivitet>();

    return (
        <div data-theme="light" className={styles.aktivitetskategorier}>
            {kategorier.map(({ aktiviteter, tittel, beskrivelse }) => {
                return (
                    <Aktivitetskategori
                        key={tittel}
                        tittel={tittel}
                        beskrivelse={beskrivelse}
                        aktiviteter={aktiviteter}
                        gjeldendeAktivitet={aktivRad}
                        onKlikkPåRad={(aktivitet) => {
                            setAktivRad((prev) => {
                                if (prev?.tittel === aktivitet.tittel) {
                                    return;
                                }
                                return aktivitet;
                            });
                        }}
                    />
                );
            })}
        </div>
    );
};

const Aktivitetskategori = ({
    aktiviteter,
    tittel,
    gjeldendeAktivitet,
    beskrivelse,
    onKlikkPåRad,
}: {
    tittel: string;
    beskrivelse: string;
    aktiviteter: Aktivitet[];
    gjeldendeAktivitet?: Aktivitet;
    onKlikkPåRad?: (aktivitet: Aktivitet) => void;
}) => {
    return (
        <article className={styles.kategori}>
            <Heading size="large" level="2">
                {tittel}
            </Heading>
            <BodyShort>{beskrivelse}</BodyShort>
            <Accordion className={styles.accordion}>
                {aktiviteter.map((aktivitet) => {
                    return (
                        <Aktivitetsrad
                            åpen={
                                aktivitet.tittel === gjeldendeAktivitet?.tittel
                            }
                            key={aktivitet.tittel}
                            aktivitet={aktivitet}
                            onClick={() => {
                                onKlikkPåRad?.(aktivitet);
                            }}
                        />
                    );
                })}
            </Accordion>
        </article>
    );
};
