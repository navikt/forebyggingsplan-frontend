import { Aktivitet } from "../../types/Aktivitet";
import {Accordion, Tag} from "@navikt/ds-react";
import styles from "./Aktivitetsrad.module.css";
import dynamic from "next/dynamic";

const Aktivitetsmal = dynamic(() =>
    import("./Aktivitetsmal").then((mod) => mod.Aktivitetsmal)
);

interface Props {
    aktivitet: Aktivitet;
    åpen?: boolean;
    onClick?: () => void;
}

export const Aktivitetsrad = ({ aktivitet, åpen = false, onClick }: Props) => {
    return (
        <Accordion.Item open={åpen}>
            <Accordion.Header
                onClick={onClick}
                className={
                    aktivitet.status === "VALGT"
                        ? styles.aktivitetValgt
                        : undefined
                }
            >
                {aktivitet.tittel} {aktivitet.status === "FULLFØRT" && <Tag variant="info">Fullført</Tag>}
            </Accordion.Header>
            <Accordion.Content>
                {åpen && <Aktivitetsmal aktivitet={aktivitet} />}
            </Accordion.Content>
        </Accordion.Item>
    );
};
