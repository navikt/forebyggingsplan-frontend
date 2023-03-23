import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import styles from "./index.module.css";
import { Aktivitet } from "../types/Aktivitet";
import { hentVerifisertToken } from "../auth";
import Layout from "../components/Layout/Layout";
import { sanity, sanityLabs } from "../lib/sanity";
import { PortableTextBlock } from "@portabletext/types";
import { SanityDocument } from "@sanity/client";
import { hentOrganisasjoner } from "../lib/organisasjoner";
import { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";
import { Kategori } from "../types/kategori";
import { Kategorier } from "../components/Forebyggingsplan/Kategorier";
import { Alert, Link } from "@navikt/ds-react";
import { useHentSykefraværsstatistikk } from "../lib/sykefraværsstatistikk-klient";
import { useHentOrgnummer } from "../components/Layout/Banner/Banner";
import { useHentValgteAktiviteter } from "../lib/forebyggingsplan-klient";
import { logger } from "../lib/logger";
import { AltinnKonfig, getAltinnKonfig, isMock } from "../lib/miljø";
import TestVersjonBanner from "../components/Banner/TestVersjonBanner";

interface Props {
    kategorier: Kategori[];
    organisasjoner: Organisasjon[];
    altinnKonfig: AltinnKonfig;
    kjørerMocket: boolean;
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

export const getServerSideProps: GetServerSideProps<Props> = async (
    context
) => {
    const kjørerMocket = isMock();
    const token = await hentVerifisertToken(context.req);
    console.log("Har token? ", token !== undefined);
    console.log("kjørMocket? ", kjørerMocket);
    console.log("Trenger innlogging? ", !token && !kjørerMocket);

    if (!token && !kjørerMocket) {
        return {
            redirect: {
                destination: "/oauth2/login",
                permanent: false,
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
        `
            )
            .catch((e) => {
                logger.error(`Sanity nedlasting feilet ${e}`);
                throw new Error("Klarte ikke å laste ned innhold");
            }),
        hentOrganisasjoner(context.req),
    ]);

    return {
        props: {
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
}: Omit<Props, "organisasjoner">) {
    const { orgnr } = useHentOrgnummer();
    const { error: statistikkError } = useHentSykefraværsstatistikk(orgnr);
    const { error: valgteAktiviteterError } = useHentValgteAktiviteter(orgnr);

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                {kjørerMocket && <TestVersjonBanner />}
                {valgteAktiviteterError?.status === 403 && (
                    <Alert variant={"warning"} className={styles.alert}>
                        Du har ikke ikke tilgang til å gjøre endringer på denne
                        siden.{" "}
                        <Link
                            href={`https://${altinnKonfig.host}/ui/DelegationRequest?offeredBy=${orgnr}&resources=${altinnKonfig.serviceCode}_${altinnKonfig.serviceEdition}`}
                        >
                            Søk om tilgang i Altinn
                        </Link>
                    </Alert>
                )}
                {valgteAktiviteterError &&
                    valgteAktiviteterError.status !== 403 && (
                        <Alert variant={"error"} className={styles.alert}>
                            Vi har ikke klart å hente ned planen deres.
                            <br /> Dere kan forsatt se aktivitetene, men ikke
                            hvilken status dere har gitt dem.
                        </Alert>
                    )}
                {statistikkError && statistikkError.status !== 403 && (
                    <Alert variant={"error"} className={styles.alert}>
                        Vi har ikke klart å hente informasjon om
                        sykefraværsstatistikk.
                    </Alert>
                )}
                <Kategorier kategorier={kategorier} />
            </main>
        </div>
    );
}

const Home = ({
    kategorier,
    organisasjoner,
    altinnKonfig,
    kjørerMocket,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
                />
            </Layout>
        </>
    );
};

export default Home;
