import { Accordion, BodyShort, Heading } from "@navikt/ds-react";
import { Aktivitetsrad } from "./Aktivitetsrad";
import { Kategori } from "../../types/kategori";
import styles from "./Aktivitetskategorier.module.css";
import { useEffect, useState } from "react";
import { Aktivitet, AktivitetStatus } from "../../types/Aktivitet";
import { useHentOrgnummer } from "../Layout/Banner/Banner";
import {ValgtAktivitet} from "../../types/ValgtAktivitet";

interface Props {
    kategorier: Kategori[];
}

function finnStatus(valgtaktivitet: ValgtAktivitet): AktivitetStatus {
    if (valgtaktivitet.fullført) return "FULLFØRT";
    return "VALGT";
}

export const Aktivitetskategorier = ({ kategorier }: Props) => {
    const [aktivRad, setAktivRad] = useState<Aktivitet>();
    const [valgteaktiviteter, setValgteaktiviteter] = useState<
        ValgtAktivitet[]
    >([]);
    const [orgnummer] = useHentOrgnummer()();
    useEffect(() => {
        if (!orgnummer) return;
        fetch(`/api/valgteaktiviteter?orgnr=${orgnummer}`)
            .then((res) => res.json())
            .then(setValgteaktiviteter);
    }, [orgnummer]);
    return (
        <div data-theme="light" className={styles.aktivitetskategorier}>
            {kategorier.map(({ aktiviteter, tittel, beskrivelse }) => {
                return (
                    <Aktivitetskategori
                        key={tittel}
                        tittel={tittel}
                        beskrivelse={beskrivelse}
                        aktiviteter={aktiviteter.map((aktivitet) => {
                            let valgtaktivitet = valgteaktiviteter.find(
                                (valgtaktivitet) =>
                                    valgtaktivitet.aktivitetsmalId ===
                                    aktivitet.aktivitetsmalId
                            );
                            if (valgtaktivitet) {
                                return {
                                    ...aktivitet,
                                    status: finnStatus(valgtaktivitet),
                                    aktivitetsId: valgtaktivitet.id
                                };
                            }
                            return aktivitet;
                        })}
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
                {aktiviteter
                    .sort((a, b) => {
                        if (a.status === b.status) return 0;
                        if (a.status === "VALGT") return -1;
                        return 1;
                    })
                    .map((aktivitet) => {
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
