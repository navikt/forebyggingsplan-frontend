import {
    AggregertStatistikkSiste4Kvartaler,
    Statistikkategori,
    useHentSykefraværsstatistikk,
} from "../../lib/sykefraværsstatistikk-klient";
import { BodyShort, Loader, Panel, Tag, Tooltip } from "@navikt/ds-react";
import { Up } from "@navikt/ds-icons";
import styles from "./Sykefraværsstatistikk.module.css";
import { useHentOrgnummer } from "../Layout/Banner/Banner";

interface StatistikkPanelProps {
    trend?: string;
    sykefravær: string;
    tittel: string;
    tooltip: string;
}

const StatistikkPanel = ({
    sykefravær,
    tittel,
    trend,
    tooltip,
}: StatistikkPanelProps) => {
    return (
        <Panel className={styles.statistikk}>
            <Tooltip content={tooltip}>
                <BodyShort>{tittel}</BodyShort>
            </Tooltip>
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

export const Sykefraværsstatistikk = () => {
    const { orgnr } = useHentOrgnummer();
    const { data: sykefraværsstatistikk, error } =
        useHentSykefraværsstatistikk(orgnr);
    if (error) return null;

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
                    tooltip={"Din bedrift"}
                />
            )}
            {sykefraværIBransje && (
                <StatistikkPanel
                    tittel={"SYKEFRAVÆR I BRANSJE"}
                    trend={trendIBransje}
                    sykefravær={sykefraværIBransje}
                    tooltip={
                        sykefraværsstatistikk.prosentSiste4KvartalerTotalt?.find(
                            (s) => s.statistikkategori === "BRANSJE"
                        )?.label ?? "Din bransje"
                    }
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
