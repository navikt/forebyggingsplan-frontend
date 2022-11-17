import { AggregertSykefraværsstatistikk } from "../../lib/sykefraværsstatistikk-klient";
import { BodyShort, Loader } from "@navikt/ds-react";
import { Up } from "@navikt/ds-icons";
import styles from "./Sykefraværsstatistikk.module.css";

interface Props {
    sykefraværsstatistikk?: AggregertSykefraværsstatistikk;
}

export const Sykefraværsstatistikk = ({ sykefraværsstatistikk }: Props) => {
    const sykefraværIVirksomhet =
        sykefraværsstatistikk?.prosentSiste4KvartalerTotalt.find(
            (e) => e.statistikkategori === "VIRKSOMHET"
        )?.verdi;
    const sykefraværIBransje =
        sykefraværsstatistikk?.prosentSiste4KvartalerTotalt.find(
            (e) => e.statistikkategori === "BRANSJE"
        )?.verdi;
    const trendIVirksomhet = sykefraværsstatistikk?.trendTotalt.find(
        (e) => e.statistikkategori === "VIRKSOMHET"
    )?.verdi;
    const trendIBransje = sykefraværsstatistikk?.trendTotalt.find(
        (e) => e.statistikkategori === "BRANSJE"
    )?.verdi;

    return sykefraværsstatistikk ? (
        <div>
            {sykefraværIVirksomhet && (
                <BodyShort>
                    I din virksomhet: {sykefraværIVirksomhet}%{" "}
                    {
                        <Up
                            className={roterEtterTrend(trendIVirksomhet)}
                            title={trendBeskrivelse(trendIVirksomhet)}
                        />
                    }
                </BodyShort>
            )}
            {sykefraværIBransje && (
                <BodyShort>
                    I din bransje: {sykefraværIBransje}%{" "}
                    {
                        <Up
                            className={roterEtterTrend(trendIBransje)}
                            title={trendBeskrivelse(trendIBransje)}
                        />
                    }
                </BodyShort>
            )}
        </div>
    ) : (
        <Loader />
    );
};

const roterEtterTrend = (trend: string | undefined): string => {
    const trendNummer = Number(trend);
    if (isNaN(trendNummer) || trendNummer === 0) {
        return styles.rotateUendret;
    } else if (trendNummer < 0) {
        return styles.rotateNed;
    } else return styles.rotateOpp;
};

const trendBeskrivelse = (trend: string | undefined): string => {
    const trendNummer = Number(trend);
    if (isNaN(trendNummer) || trendNummer === 0) {
        return "uendret trend";
    } else if (trendNummer < 0) {
        return "synkende trend";
    } else return "stigende trend";
};
