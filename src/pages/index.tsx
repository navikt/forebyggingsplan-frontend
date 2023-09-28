import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import styles from "./index.module.css";
import { Aktivitet } from "../types/Aktivitet";
import { hentVerifisertToken } from "../auth";
import Layout from "../components/Layout/Layout";
import { sanity, sanityLabs } from "../lib/klient/sanity-klient";
import { PortableTextBlock } from "@portabletext/types";
import { SanityDocument } from "@sanity/client";
import { initializeFaro, Faro } from "@grafana/faro-web-sdk";
import { hentOrganisasjoner } from "../lib/klient/organisasjoner-klient";
import { Organisasjon } from "@navikt/bedriftsmeny";
import { Kategori } from "../types/kategori";
import { Kategorier } from "../components/Forebyggingsplan/Kategorier";
import { Alert, Link } from "@navikt/ds-react";
import { useHentOrgnummer } from "../components/Layout/Banner/Banner";
import { logger } from "../lib/klient/logger-klient";
import {
    AltinnKonfig,
    getAltinnKonfig,
    isLabs,
    isMock,
} from "../lib/utils/miljø";
import TestVersjonBanner from "../components/Banner/TestVersjonBanner";
import React from "react";
import { useHentAktiviteter } from "../lib/klient/aktivitet-klient";
import { AktivitetProvider } from "../lib/context/aktivitetStatus";

interface Props {
    kategorier: Kategori[];
    organisasjoner: Organisasjon[];
    altinnKonfig: AltinnKonfig;
    kjørerMocket: boolean;
    prodUrl?: string;
}

export interface KategoriDokument extends SanityDocument {
    tittel: string;
    innhold: PortableTextBlock;
    aktiviteter: AktivitetInnhold[];
}

interface AktivitetInnhold extends SanityDocument {
    beskrivelse: string;
    embeddedInnhold: PortableTextBlock[];
    maal: string;
    tittel: string;
}

const aktivitetMapper = ({
    _id: id,
    _rev: versjon,
    maal: mål,
    tittel,
    beskrivelse,
    embeddedInnhold: innhold,
}: AktivitetInnhold): Aktivitet => ({
    aktivitetsmalId: id,
    aktivitetsmalVersjon: versjon,
    mål,
    tittel,
    beskrivelse,
    innhold,
    status: "IKKE_VALGT",
});

export const getServerSideProps: GetServerSideProps<
    Props & { grafanaUrl: string }
> = async (context) => {
    const erVedlikeholdAktivert = false;

    if (erVedlikeholdAktivert) {
        return {
            redirect: {
                destination: "/vedlikehold",
                permanent: false,
            },
        };
    }

    const kjørerMocket = isMock();
    const token = await hentVerifisertToken(context.req);

    if (!token && !kjørerMocket) {
        return {
            redirect: {
                destination: "/oauth2/login",
                permanent: false,
            },
        };
    } else if (isLabs()) {
        return {
            redirect: {
                destination:
                    "https://arbeidsgiver.ekstern.dev.nav.no/forebyggingsplan",
                permanent: true,
            },
        };
    }

    const [sanityData, organisasjoner] = await Promise.all([
        (kjørerMocket ? sanityLabs : sanity)
            .fetch(
                `
            *[_type == "kategori"] | order(orderRank) {
                tittel,
                innhold,
                "aktiviteter": *[_type == "Aktivitet" && references(^._id)] | order(orderRank)
            }
        `,
            )
            .catch((e) => {
                logger.error(`Sanity nedlasting feilet ${e}`);
                throw new Error("Klarte ikke å laste ned innhold");
            }),
        hentOrganisasjoner(context.req),
    ]);

    return {
        props: {
            grafanaUrl: process.env.GRAFANA_AGENT_COLLECTOR_URL || "",
            prodUrl: process.env.PROD_URL || "",
            kategorier: sanityData.map(({ tittel, innhold, aktiviteter }) => ({
                tittel,
                innhold,
                aktiviteter: aktiviteter.map(aktivitetMapper),
            })),
            organisasjoner,
            altinnKonfig: getAltinnKonfig(),
            kjørerMocket,
        },
    };
};

function Forside({
    kategorier,
    altinnKonfig,
    kjørerMocket,
    prodUrl,
}: Omit<Props, "organisasjoner">) {
    const { orgnr } = useHentOrgnummer();
    const { data: aktivitetStatuser, error } = useHentAktiviteter(orgnr);

    return (
        <AktivitetProvider
            aktivitetStatuser={
                Array.isArray(aktivitetStatuser) ? aktivitetStatuser : []
            }
        >
            <div className={styles.container}>
                <div className={styles.main}>
                    {kjørerMocket && <TestVersjonBanner prodUrl={prodUrl} />}
                    {error?.status === 403 && (
                        <Alert variant={"warning"} className={styles.alert}>
                            Du har ikke ikke tilgang til å gjøre endringer på
                            denne siden.{" "}
                            <Link
                                href={`https://${altinnKonfig.host}/ui/DelegationRequest?offeredBy=${orgnr}&resources=${altinnKonfig.serviceCode}_${altinnKonfig.serviceEdition}`}
                            >
                                Søk om tilgang i Altinn
                            </Link>
                        </Alert>
                    )}
                    {error && error.status !== 403 && (
                        <Alert variant={"error"} className={styles.alert}>
                            Vi har ikke klart å hente ned planen deres.
                            <br /> Dere kan forsatt se aktivitetene, men ikke
                            hvilken status dere har gitt dem.
                        </Alert>
                    )}
                    {error && error.status !== 403 && (
                        <Alert variant={"error"} className={styles.alert}>
                            Vi har ikke klart å hente informasjon om
                            sykefraværsstatistikk.
                        </Alert>
                    )}
                    <Kategorier kategorier={kategorier} />
                </div>
            </div>
        </AktivitetProvider>
    );
}

let faro: Faro | null = null;

export function getFaro(grafanaUrl: string): Faro | null {
    if (faro != null || grafanaUrl?.length === 0) return faro;
    faro = initializeFaro({
        url: grafanaUrl,
        app: {
            name: "forebyggingsplan-frontend",
            version: "dev",
        },
    });

    return faro;
}

const Home = ({
    kategorier,
    organisasjoner,
    altinnKonfig,
    kjørerMocket,
    grafanaUrl,
    prodUrl,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    React.useEffect(() => {
        getFaro(grafanaUrl);
    });

    return (
        <>
            <Head>
                <title>Slik forebygger du fravær</title>
                <meta
                    name="description"
                    content="Et verktøy der arbeidsgivere kan jobbe med å forebygge sykefravær i sin virksomhet"
                />
                <link rel="icon" href="https://nav.no/favicon.ico" />
            </Head>
            <Layout organisasjoner={organisasjoner}>
                <Forside
                    kategorier={kategorier}
                    altinnKonfig={altinnKonfig}
                    kjørerMocket={kjørerMocket}
                    prodUrl={prodUrl}
                />
            </Layout>
        </>
    );
};

export default Home;
