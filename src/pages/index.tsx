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
import { isDev, isMock } from "../lib/miljø";

interface Props {
    kategorier: Kategori[];
    organisasjoner: Organisasjon[];
    altinnKonfig: AltinnKonfig;
}

interface AltinnKonfig {
    host: string;
    serviceEdition: string;
    serviceCode: string;
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
    const kjørerSomMock = isMock();
    const token = await hentVerifisertToken(context.req);
    if (!token && !kjørerSomMock) {
        return {
            redirect: {
                destination: "/oauth2/login",
                permanent: false,
            },
        };
    }

    const [sanityData, organisasjoner] = await Promise.all([
        (kjørerSomMock ? sanityLabs : sanity)
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

    const altinnHost = isDev() ? "tt02.altinn.no" : "altinn.no";
    const serviceEdition = isDev() ? "1" : "2";
    const serviceCode = "3403";

    return {
        props: {
            kategorier: sanityData.map(({ tittel, innhold, aktiviteter }) => ({
                tittel,
                innhold,
                aktiviteter: aktiviteter.map(aktivitetMapper),
            })),
            organisasjoner,
            altinnKonfig: {
                host: altinnHost,
                serviceEdition,
                serviceCode,
            },
        },
    };
};

function Forside({ kategorier, altinnKonfig }: Omit<Props, "organisasjoner">) {
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
                <Forside kategorier={kategorier} altinnKonfig={altinnKonfig} />
            </Layout>
        </>
    );
};

export default Home;
