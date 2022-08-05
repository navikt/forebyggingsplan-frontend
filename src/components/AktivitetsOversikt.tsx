import {Table} from "@navikt/ds-react";
import {Aktivitet} from "../types/Aktivitet";

export const AktivitetsOversikt = ({aktiviteter}: {aktiviteter: Aktivitet[]}) =>
    <Table size="medium" id={"aktivitetstabell"}>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell scope="col">
                    Alle aktiviteter
                </Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {aktiviteter.map((aktivitet) =>
                <Table.Row key={aktivitet.tittel}>
                    <Table.DataCell scope="col">
                        {aktivitet.tittel}
                    </Table.DataCell>
                </Table.Row>)}
        </Table.Body>
    </Table>