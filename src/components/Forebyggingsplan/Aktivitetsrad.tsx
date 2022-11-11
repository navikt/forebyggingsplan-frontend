import { Aktivitet, AktivitetStatus } from "../../types/Aktivitet";
import { Accordion, Tag } from "@navikt/ds-react";
import styles from "./Aktivitetsrad.module.css";
import dynamic from "next/dynamic";
import {
    fullførAktivitet,
    velgAktivitet,
} from "../../lib/forebyggingsplan-klient";

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
    const velgAktivitetHandler = (frist?: Date) => {
        velgAktivitet({
            aktivitetsmalId: aktivitet.aktivitetsmalId,
            frist,
            orgnr: aktivitet.orgnr,
        })?.then(oppdaterValgteAktiviteter);
    };
    const fullførAktivitetHandler = () => {
        fullførAktivitet({
            aktivitetsmalId: aktivitet.aktivitetsmalId,
            aktivitetsId: aktivitet.aktivitetsId,
            orgnr: aktivitet.orgnr,
        })?.then(oppdaterValgteAktiviteter);
    };
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
                        velgAktivitet={velgAktivitetHandler}
                        fullførAktivitet={fullførAktivitetHandler}
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
