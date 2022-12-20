import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import styles from "./index.module.css";
import { Aktivitet } from "../types/Aktivitet";
import { hentVerifisertToken } from "../auth";
import Layout from "../components/Layout/Layout";
import { sanity } from "../lib/sanity";
import { PortableTextBlock } from "@portabletext/types";
import { SanityDocument } from "@sanity/client";
import { hentOrganisasjoner } from "../lib/organisasjoner";
import { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";
import { Kategori } from "../types/kategori";
import { Aktivitetskategorier } from "../components/Forebyggingsplan/Aktivitetskategorier";
import { Alert, Link } from "@navikt/ds-react";
import { useHentSykefraværsstatistikk } from "../lib/sykefraværsstatistikk-klient";
import { useHentOrgnummer } from "../components/Layout/Banner/Banner";
import { useHentValgteAktiviteter } from "../lib/forebyggingsplan-klient";
import { logger } from "../lib/logger";

interface Props {
    kategorier: Kategori[];
    organisasjoner: Organisasjon[];
}

interface KategoriDokument extends SanityDocument {
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
    const token = await hentVerifisertToken(context.req);
    if (!token) {
        return {
            redirect: {
                destination: "/oauth2/login",
                permanent: false,
            },
        };
    }
    const [sanityData, organisasjoner] = await Promise.all([
        sanity
            .fetch<KategoriDokument[]>(
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
        },
    };
};

function Forside({ kategorier }: Omit<Props, "organisasjoner">) {
    const { orgnr } = useHentOrgnummer();
    const { error: statistikkError } = useHentSykefraværsstatistikk(orgnr);
    const { error: valgteAktiviteterError } = useHentValgteAktiviteter(orgnr);

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                {valgteAktiviteterError?.status === 403 && (
                    <Alert variant={"info"} className={styles.alert}>
                        Du har ikke ikke tilgang til å se virksomhetens
                        sykefraværsstatistikk.{" "}
                        <Link
                            href={
                                "https://arbeidsgiver.nav.no/min-side-arbeidsgiver/informasjon-om-tilgangsstyring"
                            }
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
                <Aktivitetskategorier kategorier={kategorier} />
            </main>
        </div>
    );
}

const Home = ({
    kategorier,
    organisasjoner,
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
                <Forside kategorier={kategorier} />
            </Layout>
        </>
    );
};

export default Home;
