import { PortableTextComponentProps } from "@portabletext/react/src/types";
import styles from "./Lovpålagt.module.css";
import { Tag } from "@navikt/ds-react";

interface Props {
    tekst: string;
}

export const Lovpålagt = ({
    value: { tekst },
}: PortableTextComponentProps<Props>) => {
    return (
        <div className={styles.wrapper}>
            <Tag className={styles.tag} variant="error">
                LOVPÅLAGT
            </Tag>
            {tekst}
        </div>
    );
};
