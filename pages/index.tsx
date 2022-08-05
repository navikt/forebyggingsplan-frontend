import type { NextPage, NextPageContext } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Aktivitet } from "../src/types/Aktivitet";
import { Aktivitetsmaler } from "../src/components/Aktivitetsmaler";
import { FOREBYGGINGSPLAN_API_BASEURL } from "../src/constants";

export async function getServerSideProps(context: NextPageContext) {
    const res = await fetch(`${FOREBYGGINGSPLAN_API_BASEURL}/aktiviteter`);
    return {
        props: {
            aktiviteter: await res.json(),
        },
    };
}

const Home: NextPage<{ aktiviteter: Aktivitet[] }> = ({ aktiviteter }) => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Forebyggingsplan</title>
                <meta
                    name="description"
                    content="Et verktøy der arbeidsgivere kan jobbe med å forebygge sykefravær i sin virksomhet"
                />
                <link rel="icon" href="https://nav.no/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Forebyggingsplan</h1>

                <Aktivitetsmaler aktiviteter={aktiviteter} />
            </main>
        </div>
    );
};

export default Home;
