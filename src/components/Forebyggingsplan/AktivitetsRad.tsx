import { Aktivitet } from "../../types/Aktivitet";
import { useState } from "react";
import { Button, Table } from "@navikt/ds-react";
import { Aktivitetsmal } from "./Aktivitetsmal";
import { AddCircle } from "@navikt/ds-icons";

interface Props {
    aktivitet: Aktivitet;
}

export const AktivitetsRad = ({ aktivitet }: Props) => {
    const [erÅpen, setErÅpen] = useState<Boolean>(false);

    return (
        <Table.ExpandableRow
            content={erÅpen && <Aktivitetsmal aktivitet={aktivitet} />}
            togglePlacement="right"
            colSpan={3}
            onOpenChange={(open) => {
                setErÅpen(open);
            }}
        >
            <Table.DataCell>{aktivitet.tittel}</Table.DataCell>
            <Table.DataCell>
                <Button
                    icon={<AddCircle title="Legg til aktiviteten i Min Plan" />}
                />
            </Table.DataCell>
        </Table.ExpandableRow>
    );
};
