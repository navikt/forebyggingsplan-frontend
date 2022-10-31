import { Aktivitet } from "../../types/Aktivitet";
import { Accordion } from "@navikt/ds-react";
import { Aktivitetsmal } from "./Aktivitetsmal";
import { useState } from "react";

interface Props {
    aktivitet: Aktivitet;
}

export const Aktivitetsrad = ({ aktivitet }: Props) => {
    const [erÅpen, setErÅpen] = useState(false);

    const toggleAccordion = () => {
        setErÅpen((prevState) => !prevState)
    }

    return (
        <Accordion.Item open={erÅpen}>
            <Accordion.Header onClick={toggleAccordion}>{aktivitet.tittel}</Accordion.Header>
            <Accordion.Content>
                {erÅpen && <Aktivitetsmal aktivitet={aktivitet} />}
            </Accordion.Content>
        </Accordion.Item>
    );
};
