import { Aktivitet } from "../../types/Aktivitet";
import { Accordion } from "@navikt/ds-react";

import dynamic from "next/dynamic";

const Aktivitetsmal = dynamic(() =>
    import("./Aktivitetsmal").then((mod) => mod.Aktivitetsmal)
);

interface Props {
    aktivitet: Aktivitet;
    åpen?: boolean
    onClick?: () => void
}

export const Aktivitetsrad = ({ aktivitet, åpen = false, onClick }: Props) => {

    return (
        <Accordion.Item open={åpen}>
            <Accordion.Header onClick={onClick}>
                {aktivitet.tittel}
            </Accordion.Header>
            <Accordion.Content>
                {åpen && <Aktivitetsmal aktivitet={aktivitet} />}
            </Accordion.Content>
        </Accordion.Item>
    );
};
