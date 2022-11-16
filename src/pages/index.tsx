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

interface Props {
    kategorier: Kategori[];
    organisasjoner: Organisasjon[];
}

interface KategoriDokument extends SanityDocument {
    tittel: string;
    beskrivelse: string;
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
    try {
        const [sanityData, organisasjoner] = await Promise.all([
            sanity.fetch<KategoriDokument[]>(`
            *[_type == "kategori"] {
                tittel,
                beskrivelse,
                "aktiviteter": *[_type == "Aktivitet" && references(^._id)]
            }
        `),
            hentOrganisasjoner(context.req),
        ]);
        return {
            props: {
                kategorier: sanityData.map(
                    ({ tittel, beskrivelse, aktiviteter }) => ({
                        tittel,
                        beskrivelse,
                        aktiviteter: aktiviteter.map(aktivitetMapper),
                    })
                ),
                organisasjoner,
            },
        };
    } catch (e) {
        console.error(JSON.stringify(e));
        return {
            props: {
                kategorier: [],
                organisasjoner: [],
            },
        };
    }
};

function Forside({ kategorier }: Omit<Props, "organisasjoner">) {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
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
                <title>Forebyggingsplan</title>
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
