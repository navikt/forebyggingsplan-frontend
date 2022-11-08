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
    aktivitet: { id, beskrivelse, innhold, mål, status },
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
                            fetch("/api/aktivitet", {
                                method: "POST",
                                body: JSON.stringify({ id, orgnr }),
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            }).then((res) => {
                                return res.json();
                            });
                        }}
                    >
                        Dette vil vi gjøre
                    </Button>
                )}
                <Button variant="secondary">
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
