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

interface StatistikkPanelProps {
    trend?: string;
    sykefravær: string;
    tittel: string;
}

const StatistikkPanel = ({
    sykefravær,
    tittel,
    trend,
}: StatistikkPanelProps) => {
    return (
        <Panel className={styles.statistikk}>
            <BodyShort>{tittel}</BodyShort>
            <Tag variant={"info"} className={styles.tag}>
                {
                    <Up
                        className={`${roterEtterTrend(trend)} ${
                            styles.trendIkon
                        }`}
                        title={trendBeskrivelse(trend)}
                    />
                }
                {sykefravær} %
            </Tag>
        </Panel>
    );
};

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
                <StatistikkPanel
                    tittel={"SYKEFRAVÆR HOS DEG"}
                    trend={trendIVirksomhet}
                    sykefravær={sykefraværIVirksomhet}
                />
            )}
            {sykefraværIBransje && (
                <StatistikkPanel
                    tittel={"SYKEFRAVÆR I BRANSJE"}
                    trend={trendIBransje}
                    sykefravær={sykefraværIBransje}
                />
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
