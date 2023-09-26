import { PortableText, PortableTextComponents } from "@portabletext/react";
import { BodyLong, Heading } from "@navikt/ds-react";
import styles from "./Aktivitetsmal.module.css";
import { Seksjon } from "../../Seksjon/Seksjon";
import { Oppgave } from "../../Oppgave/Oppgave";
import { block } from "../../PortableText/block/Block";
import { marks } from "../../PortableText/marks/Marks";
import { Aktivitet } from "../../../types/Aktivitet";
import { AktivitetStatistikkType } from "../useAktivitetStatistikk";

const hovedinnhold: Partial<PortableTextComponents> = {
    types: {
        seksjon: Seksjon,
        oppgave: Oppgave,
    },
    block,
    marks,
};

interface AktivitetsmalProps {
    aktivitet: Aktivitet;
    aktivitetStatistikk: AktivitetStatistikkType;
}
export function Aktivitetsmal({
    aktivitet,
    aktivitetStatistikk,
}: AktivitetsmalProps) {
    return (
        <div className={styles.container}>
            <AktivitetsstatusBeskrivelse
                aktivitetStatistikk={aktivitetStatistikk}
            />
            <BodyLong size="large">{aktivitet.beskrivelse}</BodyLong>
            <div className={styles.mål}>
                <Heading size="medium" level="4">
                    Mål
                </Heading>
                <BodyLong size="large">{aktivitet.mål}</BodyLong>
            </div>
            <PortableText value={aktivitet.innhold} components={hovedinnhold} />
        </div>
    );
}

function AktivitetsstatusBeskrivelse({
    aktivitetStatistikk,
}: {
    aktivitetStatistikk: AktivitetStatistikkType;
}) {
    if (aktivitetStatistikk.totalt === 0) {
        return null;
    }

    if (aktivitetStatistikk.totalt === aktivitetStatistikk.ferdige) {
        return (
            <div className={styles.aktivitetsstatusBeskrivelse}>
                Alle oppgaver i denne seksjonen er ferdigstilt.
            </div>
        );
    }

    if (
        aktivitetStatistikk.ferdige === 0 &&
        aktivitetStatistikk.påbegynte === 0
    ) {
        return (
            <div className={styles.aktivitetsstatusBeskrivelse}>
                Ingen oppgaver i denne seksjonen er påbegynt.
            </div>
        );
    }

    return (
        <div className={styles.aktivitetsstatusBeskrivelse}>
            {`${aktivitetStatistikk.ferdige} oppgave${
                aktivitetStatistikk.ferdige === 1 ? "" : "r"
            } ferdig${` og ${aktivitetStatistikk.påbegynte} påbegynt`} av ${
                aktivitetStatistikk.totalt
            } tilgjengelig${
                aktivitetStatistikk.totalt === 1 ? "" : "e"
            } oppgave${aktivitetStatistikk.totalt === 1 ? "" : "r"}.`}
        </div>
    );
}
