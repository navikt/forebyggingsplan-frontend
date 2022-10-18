import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Aktivitet } from "../types/Aktivitet";
import { hentToken } from "../auth";
import { verifiserToken } from "../auth/idporten";
import { ForebyggingsplanFaner } from "../components/Forebyggingsplan/ForebyggingsplanFaner";
import Layout from "../components/Layout/Layout";
import { sanity } from "../lib/sanity";
import { PortableTextBlock } from "@portabletext/types";
import { SanityDocument } from "@sanity/client";

interface Props {
    aktiviteter: Aktivitet[];
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
    const token = hentToken(context.req!!);
    if (!token) {
        return {
            redirect: {
                destination: "/oauth2/login",
                permanent: false,
            },
        };
    }
    try {
        await verifiserToken(token);
        /*const tokenxToken = await veksleToken(
            token,
            process.env.FOREBYGGINGSPLAN_CLIENT_ID!!
        );*/ // TODO: Dette tren

        const data: SanityResponse[] = await sanity.fetch(
            '*[_type == "Aktivitet"]'
        );
        return {
            props: {
                aktiviteter: data.map(
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
            },
        };
    } catch (e) {
        console.error(JSON.stringify(e));
        return {
            props: {
                aktiviteter: [],
            },
        };
    }
};

function Forside({ aktiviteter }: Props) {
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
            <Layout>
                <Forside aktiviteter={aktiviteter} />
            </Layout>
        </>
    );
};

export default Home;
