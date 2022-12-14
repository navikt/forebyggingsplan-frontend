import useSWR from "swr";

const fetcher = (...args: [url: string, options?: RequestInit]) =>
    fetch(...args).then((res) => res.json());

export const HENT_SYKEFRAVERSSTATISTIKK_PATH = `/forebyggingsplan/api/sykefravarsstatistikk`;

export function useHentSykefraværsstatistikk(orgnummer: string | null) {
    const url = orgnummer
        ? `${HENT_SYKEFRAVERSSTATISTIKK_PATH}?orgnr=${orgnummer}`
        : null;
    return useSWR<AggregertSykefraværsstatistikk>(url, fetcher);
}

export interface AggregertSykefraværsstatistikk {
    prosentSiste4KvartalerTotalt: AggregertStatistikkSiste4Kvartaler[];
    prosentSiste4KvartalerGradert: AggregertStatistikkSiste4Kvartaler[];
    prosentSiste4KvartalerKorttid: AggregertStatistikkSiste4Kvartaler[];
    prosentSiste4KvartalerLangtid: AggregertStatistikkSiste4Kvartaler[];
    trendTotalt: AggregertStatistikkSiste4Kvartaler[];
    tapteDagsverkTotalt: AggregertStatistikkSiste4Kvartaler[];
    muligeDagsverkTotalt: AggregertStatistikkSiste4Kvartaler[];
}

export interface AggregertStatistikkSiste4Kvartaler {
    statistikkategori: Statistikkategori;
    label: string;
    verdi: string;
    antallPersonerIBeregningen: number;
    kvartalerIBeregningen: ÅrstallOgKvartal[];
}

interface ÅrstallOgKvartal {
    årstall: number;
    kvartal: number;
}

export type Statistikkategori =
    | "LAND"
    | "SEKTOR"
    | "NÆRING"
    | "BRANSJE"
    | "VIRKSOMHET"
    | "OVERORDNET_ENHET"
    | "NÆRING2SIFFER"
    | "NÆRING5SIFFER";
