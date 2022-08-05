import type {NextPage, NextPageContext} from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {Aktivitet} from "../src/types/Aktivitet";
import {Aktivitetsmaler} from "../src/components/Aktivitetsmaler";

const mockSvar: Aktivitet[] = [
    {tittel: "Aktivitet 1"},
    {tittel: "Aktivitet 2"},
    {tittel: "Aktivitet 3"},
]

export async function getServerSideProps(context: NextPageContext) {
    return {
        props: {
            aktiviteter: mockSvar
        },
    };
}

const Home: NextPage<{ aktiviteter: Aktivitet[] }> = ({aktiviteter}) => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Forebyggingsplan</title>
                <meta name="description"
                      content="Et verktøy der arbeidsgivere kan jobbe med å forebygge sykefravær i sin virksomhet"/>
                <link rel="icon" href="https://nav.no/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Forebyggingsplan
                </h1>

                <Aktivitetsmaler aktiviteter={aktiviteter} />
            </main>
        </div>
    )
}

export default Home
