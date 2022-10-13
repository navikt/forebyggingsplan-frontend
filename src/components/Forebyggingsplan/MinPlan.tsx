import { ValgtAktivitet } from "../../types/ValgtAktivitet";
import { Table } from "@navikt/ds-react";

interface Props {
    valgteAktiviteter: ValgtAktivitet[];
}

export const MinPlan = ({ valgteAktiviteter }: Props) => {
    return valgteAktiviteter.length > 0 ? (
        <Table size="medium" id={"valgteAktiviteterTabell"}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">
                        Alle aktiviteter
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col">Lagt til</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {valgteAktiviteter.map((valgtAktivitet) => (
                    <Table.Row key={valgtAktivitet.tittel}>
                        <Table.DataCell scope="col">
                            {valgtAktivitet.tittel}
                        </Table.DataCell>
                        <Table.DataCell scope="col">
                            {valgtAktivitet.valgtTidspunkt}
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    ) : (
        <p>Gå til oversikt for å velge aktiviteter</p>
    );
};
