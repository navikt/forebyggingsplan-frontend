import { Button, Table } from "@navikt/ds-react";
import { Aktivitet } from "../types/Aktivitet";
import { AddCircle } from "@navikt/ds-icons";

export const Aktivitetsmaler = ({
    aktiviteter,
}: {
    aktiviteter: Aktivitet[];
}) => (
    <div data-theme="light">
        <Table id={"aktivitetstabell"} zebraStripes>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Alle aktiviteter</Table.HeaderCell>
                    <Table.HeaderCell>Legg til</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {aktiviteter.map((aktivitet) => (
                    <Table.ExpandableRow
                        key={aktivitet.tittel}
                        content={<div>Hei</div>}
                        togglePlacement="right"
                    >
                        <Table.DataCell>{aktivitet.tittel}</Table.DataCell>
                        <Table.DataCell>
                            <Button>
                                <AddCircle />
                            </Button>
                        </Table.DataCell>
                    </Table.ExpandableRow>
                ))}
            </Table.Body>
        </Table>
    </div>
);
