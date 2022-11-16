import { AggregertSykefraværsstatistikk } from "../../lib/sykefraværsstatistikk-klient";
import { BodyShort } from "@navikt/ds-react";

interface Props {
    sykefraværsstatistikk: AggregertSykefraværsstatistikk;
}

export const Sykefraværsstatistikk = ({ sykefraværsstatistikk }: Props) => {
    return <BodyShort>Her kommer det flott statistikk</BodyShort>;
};
