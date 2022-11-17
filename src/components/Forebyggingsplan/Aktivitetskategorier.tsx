import { Accordion, BodyShort, Heading } from "@navikt/ds-react";
import { Aktivitetsrad } from "./Aktivitetsrad";
import { Kategori } from "../../types/kategori";
import styles from "./Aktivitetskategorier.module.css";
import { useState } from "react";
import {
    Aktivitet,
    AktivitetStatus,
    sorterStatus,
} from "../../types/Aktivitet";
import { useHentOrgnummer } from "../Layout/Banner/Banner";
import { ValgtAktivitet } from "../../types/ValgtAktivitet";
import { useHentValgteAktiviteter } from "../../lib/forebyggingsplan-klient";
import { loggÅpneAktivitet } from "../../lib/amplitude";
import { useHentSykefraværsstatistikk } from "../../lib/sykefraværsstatistikk-klient";
import { Sykefraværsstatistikk } from "../Sykefraværsstatistikk/Sykefraværsstatistikk";

interface Props {
    kategorier: Kategori[];
}

export function finnStatus(valgtaktivitet: ValgtAktivitet): AktivitetStatus {
    if (valgtaktivitet.fullført) return "FULLFØRT";
    return "VALGT";
}

export const Aktivitetskategorier = ({ kategorier }: Props) => {
    const [aktivRad, setAktivRad] = useState<Aktivitet>();
    const { orgnr } = useHentOrgnummer();
    const { data: valgteAktiviteter, mutate } = useHentValgteAktiviteter(orgnr);
    const { data: sykefraværsstatistikk } = useHentSykefraværsstatistikk(orgnr);
    return (
        <div data-theme="light" className={styles.aktivitetskategorier}>
            <Sykefraværsstatistikk
                sykefraværsstatistikk={sykefraværsstatistikk}
            />

            {kategorier.map(({ aktiviteter, tittel, beskrivelse }) => {
                return (
                    <Aktivitetskategori
                        key={tittel}
                        tittel={tittel}
                        beskrivelse={beskrivelse}
                        aktiviteter={aktiviteter.map((aktivitet) => {
                            const valgtAktivitet = valgteAktiviteter?.find(
                                (valgtaktivitet) =>
                                    valgtaktivitet.aktivitetsmalId ===
                                    aktivitet.aktivitetsmalId
                            );
                            if (valgtAktivitet) {
                                return {
                                    ...aktivitet,
                                    status: finnStatus(valgtAktivitet),
                                    frist: valgtAktivitet.frist,
                                    orgnr: valgtAktivitet.valgtAv.orgnr,
                                    aktivitetsId: valgtAktivitet.id,
                                };
                            }
                            return aktivitet;
                        })}
                        gjeldendeAktivitet={aktivRad}
                        onKlikkPåRad={(aktivitet) => {
                            loggÅpneAktivitet(aktivitet);
                            setAktivRad((prev) => {
                                if (prev?.tittel === aktivitet.tittel) {
                                    return;
                                }
                                return aktivitet;
                            });
                        }}
                        oppdaterValgteAktiviteter={() => mutate()}
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
    oppdaterValgteAktiviteter,
}: {
    tittel: string;
    beskrivelse: string;
    aktiviteter: Aktivitet[];
    gjeldendeAktivitet?: Aktivitet;
    onKlikkPåRad?: (aktivitet: Aktivitet) => void;
    oppdaterValgteAktiviteter: () => void;
}) => {
    return (
        <article className={styles.kategori}>
            <Heading size="large" level="2">
                {tittel}
            </Heading>
            <BodyShort>{beskrivelse}</BodyShort>
            <Accordion className={styles.accordion}>
                {aktiviteter.sort(sorterStatus).map((aktivitet) => {
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
                            oppdaterValgteAktiviteter={
                                oppdaterValgteAktiviteter
                            }
                        />
                    );
                })}
            </Accordion>
        </article>
    );
};
