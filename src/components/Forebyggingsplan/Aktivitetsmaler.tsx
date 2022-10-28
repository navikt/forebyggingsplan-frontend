import { Table } from "@navikt/ds-react";
import { Aktivitet } from "../../types/Aktivitet";
import { AktivitetsRad } from "./AktivitetsRad";

interface Props {
    aktiviteter: Aktivitet[];
}

export const Aktivitetsmaler = ({ aktiviteter }: Props) => {
    return (
        <div data-theme="light">
            <Table id={"aktivitetstabell"}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Alle aktiviteter</Table.HeaderCell>
                        <Table.HeaderCell>Legg til</Table.HeaderCell>
                        <Table.HeaderCell />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {aktiviteter.map((aktivitet) => {
                        return (
                            <AktivitetsRad
                                key={aktivitet.tittel}
                                aktivitet={aktivitet}
                            />
                        );
                    })}
                </Table.Body>
            </Table>
        </div>
    );
};
