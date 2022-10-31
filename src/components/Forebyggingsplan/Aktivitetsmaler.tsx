import { Table } from "@navikt/ds-react";
import { AktivitetsRad } from "./AktivitetsRad";
import { Kategori } from "../../types/kategori";

interface Props {
    kategorier: Kategori[];
}

export const Aktivitetsmaler = ({ kategorier }: Props) => {
    return (
        <div data-theme="light">
            {kategorier.map(({ aktiviteter, tittel }) => {
                return (
                    <Table id={`aktivitet-${tittel}`}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>{tittel}</Table.HeaderCell>
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
                );
            })}
        </div>
    );
};
