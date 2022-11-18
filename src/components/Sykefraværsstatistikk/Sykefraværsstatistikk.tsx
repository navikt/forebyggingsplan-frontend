import {
    AggregertStatistikkSiste4Kvartaler,
    AggregertSykefraværsstatistikk,
    Statistikkategori,
} from "../../lib/sykefraværsstatistikk-klient";
import { BodyShort, Loader, Panel, Tag } from "@navikt/ds-react";
import { Up } from "@navikt/ds-icons";
import styles from "./Sykefraværsstatistikk.module.css";

interface Props {
    sykefraværsstatistikk?: AggregertSykefraværsstatistikk;
}

export const Sykefraværsstatistikk = ({ sykefraværsstatistikk }: Props) => {
    const sykefraværIVirksomhet = finnStatistikkVerdi(
        "VIRKSOMHET",
        sykefraværsstatistikk?.prosentSiste4KvartalerTotalt
    );
    const sykefraværIBransje = finnStatistikkVerdi(
        "BRANSJE",
        sykefraværsstatistikk?.prosentSiste4KvartalerTotalt
    );
    const trendIVirksomhet = finnStatistikkVerdi(
        "VIRKSOMHET",
        sykefraværsstatistikk?.trendTotalt
    );
    const trendIBransje = finnStatistikkVerdi(
        "BRANSJE",
        sykefraværsstatistikk?.trendTotalt
    );

    return sykefraværsstatistikk ? (
        <div className={styles.statistikkContainer}>
            {sykefraværIVirksomhet && (
                <Panel className={styles.statistikk}>
                    <BodyShort>SYKEFRAVÆR HOS DERE</BodyShort>
                    <Tag
                        variant={trendVariant(trendIVirksomhet)}
                        className={styles.tag}
                    >
                        {
                            <Up
                                className={roterEtterTrend(trendIVirksomhet)}
                                title={trendBeskrivelse(trendIVirksomhet)}
                            />
                        }
                        {sykefraværIVirksomhet} %
                    </Tag>
                </Panel>
            )}
            {sykefraværIBransje && (
                <Panel className={styles.statistikk}>
                    <BodyShort>SYKEFRAVÆR I BRANSJEN</BodyShort>
                    <Tag
                        variant={trendVariant(trendIBransje)}
                        className={styles.tag}
                    >
                        {
                            <Up
                                className={roterEtterTrend(trendIBransje)}
                                title={trendBeskrivelse(trendIBransje)}
                            />
                        }
                        {sykefraværIBransje} %
                    </Tag>
                </Panel>
            )}
        </div>
    ) : (
        <Loader variant="interaction" />
    );
};

const finnStatistikkVerdi = (
    kategori: Statistikkategori,
    liste?: AggregertStatistikkSiste4Kvartaler[]
): string | undefined => {
    return liste?.find((e) => e.statistikkategori === kategori)?.verdi;
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

type TagVariant = "info" | "warning" | "success";

const trendVariant = (trend: string | undefined): TagVariant => {
    const trendNummer = Number(trend);
    if (isNaN(trendNummer) || trendNummer === 0) {
        return "info";
    } else if (trendNummer < 0) {
        return "warning";
    } else return "success";
};
