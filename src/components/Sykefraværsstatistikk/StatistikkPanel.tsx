import styles from "./StatistikkPanel.module.css";
import { BodyShort, Panel, Tooltip } from "@navikt/ds-react";
import { ArrowUpIcon } from "@navikt/aksel-icons";

interface StatistikkPanelProps {
    trend?: string;
    sykefravær: string;
    tittel: string;
    tooltip: string;
    bakgrunnsfarge?: Bakgrunnsfarger;
}

export const StatistikkPanel = ({
    sykefravær,
    tittel,
    trend,
    tooltip,
    bakgrunnsfarge = "HVIT",
}: StatistikkPanelProps) => {
    return (
        <Panel
            className={`${styles.statistikk} ${PanelBakgrunn[bakgrunnsfarge]}`}
        >
            <Tooltip content={tooltip}>
                <BodyShort size={"small"} className={styles.tittel}>
                    {tittel}
                </BodyShort>
            </Tooltip>
            <BodyShort className={styles.tallContainer}>
                <ArrowUpIcon
                    className={roterEtterTrend(trend)}
                    title={trendBeskrivelse(trend)}
                    fontSize="1rem"
                />
                {`${sykefravær} %`}
            </BodyShort>
        </Panel>
    );
};

const roterEtterTrend = (trend: string | undefined): string => {
    const trendNummer = Number(trend);
    if (Number.isNaN(trendNummer) || trendNummer === 0) {
        return styles.rotateUendret;
    } else if (trendNummer < 0) {
        return styles.rotateNed;
    } else return styles.rotateOpp;
};

const trendBeskrivelse = (trend: string | undefined): string => {
    const trendNummer = Number(trend);
    if (Number.isNaN(trendNummer) || trendNummer === 0) {
        return "uendret trend";
    } else if (trendNummer < 0) {
        return "synkende trend";
    } else return "stigende trend";
};

const PanelBakgrunn: { [key in Bakgrunnsfarger]: string } = {
    HVIT: styles.hvitBakgrunn,
    GRÅ: styles.gråBakgrunn,
};

export type Bakgrunnsfarger = "HVIT" | "GRÅ";
