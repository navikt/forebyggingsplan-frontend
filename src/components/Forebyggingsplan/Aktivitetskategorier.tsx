import { Accordion, Heading, Ingress } from "@navikt/ds-react";
import { Aktivitetsrad } from "./Aktivitetsrad";
import { Kategori } from "../../types/kategori";
import styles from "./Aktivitetskategorier.module.css";
import { useCallback, useRef, useState } from "react";
import {
    Aktivitet,
    AktivitetStatus,
    sorterStatus,
} from "../../types/Aktivitet";
import { useHentOrgnummer } from "../Layout/Banner/Banner";
import { ValgtAktivitet } from "../../types/ValgtAktivitet";
import { useHentValgteAktiviteter } from "../../lib/forebyggingsplan-klient";
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
    return (
        <div data-theme="light" className={styles.aktivitetskategorier}>
            <Sykefraværsstatistikk />
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
                                    fullførtTidspunkt:
                                        valgtAktivitet.fullførtTidspunkt,
                                    orgnr: valgtAktivitet.valgtAv.orgnr,
                                    aktivitetsId: valgtAktivitet.id,
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
    const articleRef = useRef<HTMLElement | null>(null);

    const scrollTilKategori = useCallback(() => {
        articleRef?.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, []);

    return (
        <article className={styles.kategori} ref={articleRef}>
            <Heading size="large" level="2">
                {tittel}
            </Heading>
            <Ingress>{beskrivelse}</Ingress>
            <Accordion className={styles.accordion}>
                {aktiviteter.sort(sorterStatus).map((aktivitet) => (
                    <Aktivitetsrad
                        åpen={aktivitet.tittel === gjeldendeAktivitet?.tittel}
                        key={aktivitet.tittel}
                        aktivitet={aktivitet}
                        onClick={() => {
                            onKlikkPåRad?.(aktivitet);
                        }}
                        onClose={scrollTilKategori}
                        oppdaterValgteAktiviteter={oppdaterValgteAktiviteter}
                    />
                ))}
            </Accordion>
        </article>
    );
};
