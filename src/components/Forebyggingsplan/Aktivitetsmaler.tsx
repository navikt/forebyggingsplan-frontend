import { Accordion, BodyShort, Heading } from "@navikt/ds-react";
import { AktivitetsRad } from "./AktivitetsRad";
import { Kategori } from "../../types/kategori";

interface Props {
    kategorier: Kategori[];
}

export const Aktivitetsmaler = ({ kategorier }: Props) => {
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
                                    <AktivitetsRad
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
