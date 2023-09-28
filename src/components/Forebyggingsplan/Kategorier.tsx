import { Accordion, Heading } from "@navikt/ds-react";
import { Aktivitetsrad } from "./Aktivitetsrad";
import { Kategori, kategoriComponents } from "../../types/kategori";
import styles from "./Kategorier.module.css";
import { Aktivitet, sorterStatus } from "../../types/Aktivitet";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";

interface Props {
    kategorier: Kategori[];
}

export const Kategorier = ({ kategorier }: Props) => {
    return (
        <div data-theme="light" className={styles.kategorier}>
            {kategorier.map(({ aktiviteter, tittel, innhold }) => {
                if (aktiviteter.length < 1) return null;
                return (
                    <Kategori
                        key={tittel}
                        tittel={tittel}
                        innhold={innhold}
                        aktiviteter={aktiviteter}
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
}: {
    tittel: string;
    innhold: PortableTextBlock;
    aktiviteter: Aktivitet[];
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
                    />
                ))}
            </Accordion>
        </article>
    );
};
