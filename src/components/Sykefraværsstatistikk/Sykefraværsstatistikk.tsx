import {
    AggregertStatistikkSiste4Kvartaler,
    Statistikkategori,
    useHentSykefraværsstatistikk,
} from "../../lib/sykefraværsstatistikk-klient";
import { Loader } from "@navikt/ds-react";
import styles from "./Sykefraværsstatistikk.module.css";
import { useHentOrgnummer } from "../Layout/Banner/Banner";
import { StatistikkPanel } from "./StatistikkPanel";
import { PortableTextComponentProps } from "@portabletext/react";
import { Bakgrunnsfarger } from "./StatistikkPanel";

interface Props {
    bakgrunnsfarge: string;
}

export const Sykefraværsstatistikk = ({
    value: { bakgrunnsfarge },
}: PortableTextComponentProps<Props>) => {
    const { orgnr } = useHentOrgnummer();
    const { data: sykefraværsstatistikk, error } =
        useHentSykefraværsstatistikk(orgnr);
    if (!orgnr) return null; // Ingen statistikk å vise uten orgnr
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
                    tittel={"Sykefravær hos deg"}
                    trend={trendIVirksomhet}
                    sykefravær={sykefraværIVirksomhet}
                    tooltip={"Din bedrift"}
                    bakgrunnsfarge={bakgrunnsfarge as Bakgrunnsfarger}
                />
            )}
            {sykefraværIBransje && (
                <StatistikkPanel
                    tittel={"Sykefravær i bransje"}
                    trend={trendIBransje}
                    sykefravær={sykefraværIBransje}
                    tooltip={
                        sykefraværsstatistikk.prosentSiste4KvartalerTotalt?.find(
                            (s) => s.statistikkategori === "BRANSJE"
                        )?.label ?? "Din bransje"
                    }
                    bakgrunnsfarge={bakgrunnsfarge as Bakgrunnsfarger}
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
