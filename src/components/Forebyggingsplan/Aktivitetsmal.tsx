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
            {status !== "VALGT" && (
                <Button
                    className={styles.button}
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
            {beskrivelse}
            <Heading size="medium" level="3">
                Mål
            </Heading>
            {mål}

            <PortableText value={innhold} components={hovedinnhold} />
        </div>
    );
}
