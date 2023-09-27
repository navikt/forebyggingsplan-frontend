import { Accordion, Heading } from "@navikt/ds-react";
import { Aktivitetsrad } from "./Aktivitetsrad";
import { Kategori, kategoriComponents } from "../../types/kategori";
import styles from "./Kategorier.module.css";
import {
    Aktivitet,
    AktivitetStatus,
    sorterStatus,
} from "../../types/Aktivitet";
import { useHentOrgnummer } from "../Layout/Banner/Banner";
import { FullførtAktivitet } from "../../types/ValgtAktivitet";
import { useHentValgteAktiviteter } from "../../lib/klient/forebyggingsplan-klient";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";

interface Props {
    kategorier: Kategori[];
}

export function finnStatus(valgtaktivitet: FullførtAktivitet): AktivitetStatus {
    if (valgtaktivitet.fullført) return "FULLFØRT";
    return "VALGT";
}

export const Kategorier = ({ kategorier }: Props) => {
    const { orgnr } = useHentOrgnummer();
    const { data: valgteAktiviteter, mutate } = useHentValgteAktiviteter(orgnr);

    return (
        <div data-theme="light" className={styles.kategorier}>
            {kategorier.map(({ aktiviteter, tittel, innhold }) => {
                if (aktiviteter.length < 1) return null;
                return (
                    <Kategori
                        key={tittel}
                        tittel={tittel}
                        innhold={innhold}
                        aktiviteter={aktiviteter.map((aktivitet) => {
                            const valgtAktivitet = valgteAktiviteter?.find(
                                (valgtaktivitet) =>
                                    valgtaktivitet.aktivitetsId ===
                                    aktivitet.aktivitetsmalId,
                            );
                            if (valgtAktivitet) {
                                return {
                                    ...aktivitet,
                                    status: finnStatus(valgtAktivitet),
                                    fullfortTidspunkt:
                                        valgtAktivitet.fullførtTidspunkt,
                                    aktivitetsId: valgtAktivitet.id,
                                };
                            }
                            return aktivitet;
                        })}
                        oppdaterValgteAktiviteter={() => mutate()}
                    />
                );
            })}
        </div>
    );
};

const Kategori = ({
    aktiviteter,
    tittel,
    innhold,
    oppdaterValgteAktiviteter,
}: {
    tittel: string;
    innhold: PortableTextBlock;
    aktiviteter: Aktivitet[];
    oppdaterValgteAktiviteter: () => void;
}) => {
    return (
        <article className={styles.kategori}>
            <Heading size="large" level="2" spacing>
                {tittel}
            </Heading>
            <PortableText value={innhold} components={kategoriComponents} />
            <Accordion className={styles.accordion}>
                {aktiviteter.sort(sorterStatus).map((aktivitet) => (
                    <Aktivitetsrad
                        key={aktivitet.tittel}
                        aktivitet={aktivitet}
                        oppdaterValgteAktiviteter={oppdaterValgteAktiviteter}
                    />
                ))}
            </Accordion>
        </article>
    );
};
