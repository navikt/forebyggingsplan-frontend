import { Aktivitet } from "../../types/Aktivitet";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { Button, Heading } from "@navikt/ds-react";

import styles from "./Aktivitetsmal.module.css";
import { Seksjon } from "../Seksjon/Seksjon";
import { block } from "../PortableText/block/Block";
import { marks } from "../PortableText/marks/Marks";
import { useHentOrgnummer } from "../Layout/Banner/Banner";
import {fullførAktivitet, velgAktivitet} from "../../lib/forebyggingsplan-klient";

const hovedinnhold: Partial<PortableTextComponents> = {
    types: {
        seksjon: Seksjon,
    },
    block,
    marks,
};

export function Aktivitetsmal({
    aktivitet: { aktivitetsmalId, beskrivelse, innhold, mål, aktivitetsId, status },
    oppdaterValgteAktiviteter
}: {
    aktivitet: Aktivitet,
    oppdaterValgteAktiviteter: () => void
}) {
    const [orgnr] = useHentOrgnummer()();
    return (
        <div className={styles.container}>
            <span className={styles.knappeContainer}>
                {status === "IKKE_VALGT" && (
                    <Button
                        variant="secondary"
                        onClick={() => {
                            // if (!orgnr) { setErrorstate("orgnummer mangler") }
                            orgnr && velgAktivitet({ aktivitetsmalId: aktivitetsmalId, orgnr: orgnr })
                                .then(oppdaterValgteAktiviteter)
                        }}
                    >
                        Dette vil vi gjøre
                    </Button>
                )}
                {["IKKE_VALGT", "VALGT"].includes(status) &&
                    <Button variant="secondary" onClick={() => {
                        // if (!orgnr) { setErrorstate("orgnummer mangler") }
                        orgnr && aktivitetsmalId &&
                        fullførAktivitet({ aktivitetsId: aktivitetsId, aktivitetsmalId: aktivitetsmalId, orgnr: orgnr})
                            .then(oppdaterValgteAktiviteter)
                    }}>
                        {status === "VALGT" ? "Ferdig" : "Dette har vi på plass"}
                    </Button>
                }
            </span>
            {beskrivelse}
            <Heading size="medium" level="3">
                Mål
            </Heading>
            {mål}

            <PortableText value={innhold} components={hovedinnhold} />
        </div>
    );
}
