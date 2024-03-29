import { AggregertSykefraværsstatistikk } from "../lib/klient/sykefraværsstatistikk-klient";

export const sykefraværsstatistikkMock: AggregertSykefraværsstatistikk = {
    prosentSiste4KvartalerTotalt: [
        {
            statistikkategori: "VIRKSOMHET",
            label: "Virksomhet",
            verdi: "8.8",
            antallPersonerIBeregningen: 145,
            kvartalerIBeregningen: [
                { årstall: 2021, kvartal: 2 },
                { årstall: 2021, kvartal: 3 },
                {
                    årstall: 2021,
                    kvartal: 4,
                },
                { årstall: 2022, kvartal: 1 },
            ],
        },
        {
            statistikkategori: "BRANSJE",
            label: "Sykehjem",
            verdi: "9.2",
            antallPersonerIBeregningen: 382034,
            kvartalerIBeregningen: [
                { årstall: 2021, kvartal: 2 },
                { årstall: 2021, kvartal: 3 },
                {
                    årstall: 2021,
                    kvartal: 4,
                },
                { årstall: 2022, kvartal: 1 },
            ],
        },
        {
            statistikkategori: "LAND",
            label: "Norge",
            verdi: "5.5",
            antallPersonerIBeregningen: 12247515,
            kvartalerIBeregningen: [
                { årstall: 2021, kvartal: 2 },
                { årstall: 2021, kvartal: 3 },
                {
                    årstall: 2021,
                    kvartal: 4,
                },
                { årstall: 2022, kvartal: 1 },
            ],
        },
    ],
    prosentSiste4KvartalerGradert: [
        {
            statistikkategori: "BRANSJE",
            label: "Sykehjem",
            verdi: "33.4",
            antallPersonerIBeregningen: 382034,
            kvartalerIBeregningen: [
                { årstall: 2021, kvartal: 2 },
                { årstall: 2021, kvartal: 3 },
                {
                    årstall: 2021,
                    kvartal: 4,
                },
                { årstall: 2022, kvartal: 1 },
            ],
        },
    ],
    prosentSiste4KvartalerKorttid: [
        {
            statistikkategori: "BRANSJE",
            label: "Sykehjem",
            verdi: "1.4",
            antallPersonerIBeregningen: 382034,
            kvartalerIBeregningen: [
                { årstall: 2021, kvartal: 3 },
                { årstall: 2021, kvartal: 2 },
                {
                    årstall: 2021,
                    kvartal: 4,
                },
                { årstall: 2022, kvartal: 1 },
            ],
        },
    ],
    prosentSiste4KvartalerLangtid: [
        {
            statistikkategori: "BRANSJE",
            label: "Sykehjem",
            verdi: "7.8",
            antallPersonerIBeregningen: 382034,
            kvartalerIBeregningen: [
                { årstall: 2021, kvartal: 3 },
                { årstall: 2021, kvartal: 2 },
                {
                    årstall: 2021,
                    kvartal: 4,
                },
                { årstall: 2022, kvartal: 1 },
            ],
        },
    ],
    trendTotalt: [
        {
            statistikkategori: "BRANSJE",
            label: "Sykehjem",
            verdi: "-0.1",
            antallPersonerIBeregningen: 186726,
            kvartalerIBeregningen: [
                { årstall: 2022, kvartal: 1 },
                { årstall: 2021, kvartal: 1 },
            ],
        },
    ],
    tapteDagsverkTotalt: [],
    muligeDagsverkTotalt: [],
};
