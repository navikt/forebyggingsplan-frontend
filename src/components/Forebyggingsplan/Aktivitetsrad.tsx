import { Aktivitet, AktivitetStatus } from "../../types/Aktivitet";
import { Accordion, Tag } from "@navikt/ds-react";
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

export const Aktivitetsrad = ({
    aktivitet,
    åpen = false,
    onClick,
    oppdaterValgteAktiviteter,
}: Props) => {
    return (
        <Accordion.Item open={åpen}>
            <Accordion.Header
                onClick={onClick}
                className={AktivitetStatusStyle[aktivitet.status]}
            >
                {aktivitet.tittel}{" "}
                {aktivitet.status === "FULLFØRT" && (
                    <Tag variant="info">Fullført</Tag>
                )}{" "}
                {aktivitet.frist ?? ""}
            </Accordion.Header>
            <Accordion.Content>
                {åpen && (
                    <Aktivitetsmal
                        aktivitet={aktivitet}
                        oppdaterValgteAktiviteter={oppdaterValgteAktiviteter}
                    />
                )}
            </Accordion.Content>
        </Accordion.Item>
    );
};

const AktivitetStatusStyle: { [key in AktivitetStatus]: string } = {
    IKKE_VALGT: styles.aktivitetIkkeValgt,
    VALGT: styles.aktivitetValgt,
    FULLFØRT: styles.aktivitetFullført,
};
