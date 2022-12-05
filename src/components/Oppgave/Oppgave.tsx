import styles from "./Oppgave.module.css";
import { Heading, Panel, Tag } from "@navikt/ds-react";
import { PortableText, PortableTextComponentProps } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { block } from "../PortableText/block/Block";
import { marks } from "../PortableText/marks/Marks";

interface Props {
    tittel: string;
    innhold: PortableTextBlock[];
}

export const Oppgave = ({
    value: { tittel, innhold },
}: PortableTextComponentProps<Props>) => {
    return (
        <Panel className={styles.wrapper}>
            <Tag className={styles.tag} variant="neutral">
                Oppgave
            </Tag>
            <Heading size={"medium"}>{tittel}</Heading>
            <PortableText
                value={innhold}
                components={{
                    block,
                    marks,
                }}
            />
        </Panel>
    );
};
