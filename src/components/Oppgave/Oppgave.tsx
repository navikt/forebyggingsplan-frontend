import { PortableTextComponentProps } from "@portabletext/react/src/types";
import styles from "./Oppgave.module.css";
import { Tag } from "@navikt/ds-react";

interface Props {
    tekst: string;
}

export const Oppgave = ({
    value: { tekst },
}: PortableTextComponentProps<Props>) => {
    return (
        <div className={styles.wrapper}>
            <Tag className={styles.tag} variant="neutral">
                Oppgave
            </Tag>
            {tekst}
        </div>
    );
};
