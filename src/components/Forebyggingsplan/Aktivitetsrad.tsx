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
    oppdaterValgteAktiviteter: () => void;
}

export const Aktivitetsrad = ({ aktivitet, åpen = false, onClick, oppdaterValgteAktiviteter }: Props) => {
    return (
        <Accordion.Item open={åpen}>
            <Accordion.Header
                onClick={onClick}
                className={styleAktivitetBasertPåStatus(aktivitet)}
            >
                {aktivitet.tittel} {aktivitet.status === "FULLFØRT" && <Tag variant="info">Fullført</Tag>}
            </Accordion.Header>
            <Accordion.Content>
                {åpen && <Aktivitetsmal aktivitet={aktivitet} oppdaterValgteAktiviteter={oppdaterValgteAktiviteter}/>}
            </Accordion.Content>
        </Accordion.Item>
    );
};


const styleAktivitetBasertPåStatus = (aktivitet: Aktivitet): string => {
    switch(aktivitet.status){
        case "IKKE_VALGT":
            return styles.aktivitetIkkeValgt
        case "VALGT":
            return styles.aktivitetValgt
        case "FULLFØRT":
            return styles.aktivitetFullført
    }
}
