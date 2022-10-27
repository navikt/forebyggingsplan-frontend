import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Aktivitet } from "../types/Aktivitet";
import { hentVerifisertToken } from "../auth";
import { ForebyggingsplanFaner } from "../components/Forebyggingsplan/ForebyggingsplanFaner";
import Layout from "../components/Layout/Layout";
import { sanity } from "../lib/sanity";
import { PortableTextBlock } from "@portabletext/types";
import { SanityDocument } from "@sanity/client";
import { hentOrganisasjoner } from "../lib/organisasjoner";
import { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";

interface Props {
    aktiviteter: Aktivitet[];
    organisasjoner: Organisasjon[];
}

interface SanityResponse extends SanityDocument {
    beskrivelse: string;
    embeddedInnhold: PortableTextBlock[];
    maal: string;
    tittel: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
    context
) => {
    const token = await hentVerifisertToken(context.req!!);
    if (!token) {
        return {
            redirect: {
                destination: "/oauth2/login",
                permanent: false,
            },
        };
    }
    try {
        /*const tokenxToken = await veksleToken(
            token,
            process.env.FOREBYGGINGSPLAN_CLIENT_ID!!
        );*/ // TODO: Dette tren

        const [sanityData, organisasjoner] = await Promise.all([
            sanity.fetch<SanityResponse[]>('*[_type == "Aktivitet"]'),
            hentOrganisasjoner(context.req),
        ]);
        return {
            props: {
                aktiviteter: sanityData.map(
                    ({
                        maal: mål,
                        tittel,
                        beskrivelse,
                        embeddedInnhold: innhold,
                    }) => ({
                        mål,
                        tittel,
                        beskrivelse,
                        innhold,
                    })
                ),
                organisasjoner,
            },
        };
    } catch (e) {
        console.error(JSON.stringify(e));
        return {
            props: {
                aktiviteter: [],
                organisasjoner: [],
            },
        };
    }
};

function Forside({ aktiviteter }: Omit<Props, "organisasjoner">) {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>Forebyggingsplan</h1>
                <ForebyggingsplanFaner
                    aktiviteter={aktiviteter}
                    valgteAktiviteter={[]}
                />
            </main>
        </div>
    );
}

const Home = ({
    aktiviteter,
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
                <Forside aktiviteter={aktiviteter} />
            </Layout>
        </>
    );
};

export default Home;
