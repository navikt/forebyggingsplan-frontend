import {Button, Table} from "@navikt/ds-react";
import {Aktivitet} from "../types/Aktivitet";
import { AddCircle } from "@navikt/ds-icons";

export const Aktivitetsmaler = ({aktiviteter}: {aktiviteter: Aktivitet[]}) =>
    <Table size="medium" id={"aktivitetstabell"}>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell scope="col">
                    Alle aktiviteter
                </Table.HeaderCell>
                <Table.HeaderCell scope="col">
                    Legg til
                </Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {aktiviteter.map((aktivitet) =>
                <Table.Row key={aktivitet.tittel}>
                    <Table.DataCell scope="col">
                        {aktivitet.tittel}
                    </Table.DataCell>
                    <Table.DataCell>
                        <Button>
                            <AddCircle/>
                        </Button>
                    </Table.DataCell>
                </Table.Row>)}
        </Table.Body>
    </Table>
