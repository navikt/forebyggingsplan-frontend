import styles from "./Oppgave.module.css";
import { Heading, Panel, Tag } from "@navikt/ds-react";
import { PortableText, PortableTextComponentProps } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { block } from "../PortableText/block/Block";
import { marks } from "../PortableText/marks/Marks";

interface Props {
    oppgavetype: string;
    tittel: string;
    innhold: PortableTextBlock[];
    id: string;
}

export const Oppgave = ({
    value: { oppgavetype, tittel, innhold, id },
}: PortableTextComponentProps<Props>) => {
    return (
        <Panel className={styles.oppgaveblokk}>
            <Tag className={styles.tag} variant="neutral">
                {oppgavetype}
            </Tag>
            <div className={styles.oppgaveinnhold}>
                <Heading size={"medium"} level="4" spacing>
                    {tittel}
                </Heading>
                <>{id}</>
                <PortableText
                    value={innhold}
                    components={{
                        block,
                        marks,
                    }}
                />
            </div>
        </Panel>
    );
};
