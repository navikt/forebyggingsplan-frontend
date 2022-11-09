import { Aktivitet } from "../../types/Aktivitet";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { Button, Heading } from "@navikt/ds-react";

import styles from "./Aktivitetsmal.module.css";
import { Seksjon } from "../Seksjon/Seksjon";
import { block } from "../PortableText/block/Block";
import { marks } from "../PortableText/marks/Marks";
import { useHentOrgnummer } from "../Layout/Banner/Banner";

const hovedinnhold: Partial<PortableTextComponents> = {
    types: {
        seksjon: Seksjon,
    },
    block,
    marks,
};

export function Aktivitetsmal({
    aktivitet: { aktivitetsmalId, beskrivelse, innhold, mål, aktivitetsId, status },
}: {
    aktivitet: Aktivitet;
}) {
    const [orgnr] = useHentOrgnummer()();
    return (
        <div className={styles.container}>
            <span className={styles.knappeContainer}>
                {status !== "VALGT" && (
                    <Button
                        variant="secondary"
                        onClick={() => {
                            // if (!orgnr) { setErrorstate("orgnummer mangler") }
                            orgnr && velgAktivitet({ aktivitetsmalId: aktivitetsmalId, orgnr: orgnr })
                        }}
                    >
                        Dette vil vi gjøre
                    </Button>
                )}
                <Button variant="secondary" onClick={() => {
                    // if (!orgnr) { setErrorstate("orgnummer mangler") }
                    orgnr && aktivitetsmalId && fullførAktivitet({ aktivitetsId: aktivitetsId, aktivitetsmalId: aktivitetsmalId, orgnr: orgnr})
                }}>
                    {status === "VALGT" ? "Ferdig" : "Dette har vi på plass"}
                </Button>
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


interface ValgtAktivitetDTO {
    aktivitetsmalId: string;
    orgnr: string;
}

function velgAktivitet(valgtAktivitetDto: ValgtAktivitetDTO) {
    return fetch("/api/aktivitet", {
        method: "POST",
        body: JSON.stringify({ aktivitetsmalId: valgtAktivitetDto.aktivitetsmalId, orgnr: valgtAktivitetDto.orgnr }),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res) => {
        return res.json();
    });
}


interface FullførAktivitetDTO {
    aktivitetsId?: number;
    aktivitetsmalId: string;
    orgnr: string;
}

function fullførAktivitet(fullførAktivitetDto: FullførAktivitetDTO) {
    return fetch("/api/fullfor", {
        method: "POST",
        body: JSON.stringify({
            aktivitetsId: fullførAktivitetDto.aktivitetsId,
            aktivitetsmalId: `${fullførAktivitetDto.aktivitetsmalId}`,
            orgnr: fullførAktivitetDto.orgnr
        }),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res) => {
        return res.json();
    });
}

