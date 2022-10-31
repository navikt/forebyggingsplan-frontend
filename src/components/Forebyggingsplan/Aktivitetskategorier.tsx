import { Accordion, BodyShort, Heading } from "@navikt/ds-react";
import { Aktivitetsrad } from "./Aktivitetsrad";
import { Kategori } from "../../types/kategori";

interface Props {
    kategorier: Kategori[];
}

export const Aktivitetskategorier = ({ kategorier }: Props) => {
    return (
        <div data-theme="light">
            {kategorier.map(({aktiviteter, tittel, beskrivelse}) => {
                return (
                    <article key={tittel}>
                        <Heading size="large">{tittel}</Heading>
                        <BodyShort>{beskrivelse}</BodyShort>
                        <Accordion>
                            {aktiviteter.map((aktivitet) => {
                                return (
                                    <Aktivitetsrad
                                        key={aktivitet.tittel}
                                        aktivitet={aktivitet}
                                    />
                                );
                            })}
                        </Accordion>
                    </article>
                );
            })}
        </div>
    );
};
