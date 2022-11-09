import {Accordion, BodyShort, Heading} from "@navikt/ds-react";
import {Aktivitetsrad} from "./Aktivitetsrad";
import {Kategori} from "../../types/kategori";
import styles from "./Aktivitetskategorier.module.css";
import {useState} from "react";
import {Aktivitet, AktivitetStatus} from "../../types/Aktivitet";
import {useHentOrgnummer} from "../Layout/Banner/Banner";
import {ValgtAktivitet} from "../../types/ValgtAktivitet";
import {useHentValgteAktiviteter} from "../../lib/forebyggingsplan-klient";

interface Props {
    kategorier: Kategori[];
}

export function finnStatus(valgtaktivitet: ValgtAktivitet): AktivitetStatus {
    if (valgtaktivitet.fullført) return "FULLFØRT";
    return "VALGT";
}

export const Aktivitetskategorier = ({ kategorier }: Props) => {
    const [aktivRad, setAktivRad] = useState<Aktivitet>();
    const [orgnummer] = useHentOrgnummer()();
    const { data: valgteAktiviteter, mutate } = useHentValgteAktiviteter(orgnummer)
    return (
        <div data-theme="light" className={styles.aktivitetskategorier}>
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
                                    aktivitetsId: valgtAktivitet.id
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
                     oppdaterValgteAktiviteter={() => console.log("Skal oppdatere valgte")}/>
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
    oppdaterValgteAktiviteter: () => void,
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
                                oppdaterValgteAktiviteter={() => oppdaterValgteAktiviteter}/>
                        );
                    })}
            </Accordion>
        </article>
    );
};
