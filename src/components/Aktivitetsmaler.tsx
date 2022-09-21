import { Button, Table } from "@navikt/ds-react";
import { Aktivitet } from "../types/Aktivitet";
import { AddCircle } from "@navikt/ds-icons";

interface Props {
    aktiviteter: Aktivitet[];
}

export const Aktivitetsmaler = ({aktiviteter}: Props) => (
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
                {aktiviteter.map((aktivitet) => (
                    <Table.ExpandableRow
                        key={aktivitet.tittel}
                        content={<div>Hei</div>}
                        togglePlacement="right"
                        colSpan={3}
                    >
                        <Table.DataCell>{aktivitet.tittel}</Table.DataCell>
                        <Table.DataCell>
                            <Button icon={<AddCircle title="Legg til aktiviteten i Min Plan" />} />
                        </Table.DataCell>
                    </Table.ExpandableRow>
                ))}
            </Table.Body>
        </Table>
    </div>
);
