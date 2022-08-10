import type { NextPage, NextPageContext } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Aktivitet } from "../src/types/Aktivitet";
import { Aktivitetsmaler } from "../src/components/Aktivitetsmaler";
import { FOREBYGGINGSPLAN_API_BASEURL } from "../src/constants";
import {Tabs} from "@navikt/ds-react";

export async function getServerSideProps(context: NextPageContext) {
    const res = await fetch(`${FOREBYGGINGSPLAN_API_BASEURL}/aktiviteter`);
    return {
        props: {
            aktiviteter: await res.json(),
        },
    };
}

const navigasjonKonstanter = {
    aktivitetsOversiktTab : {
        label: "Oversikt",
        key: "aktiviteter"
    },
    forebyggingsplanTab : {
        label: "Plan",
        key: "plan"
    },
    fullførteAktiviteterTab : {
        label: "Oversikt",
        key: "fullførteAktiviteter"
    }
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
                <Tabs defaultValue={navigasjonKonstanter.aktivitetsOversiktTab.key} size="medium">
                    <Tabs.List>
                        <Tabs.Tab value={navigasjonKonstanter.aktivitetsOversiktTab.key} label={navigasjonKonstanter.aktivitetsOversiktTab.label}/>
                        <Tabs.Tab value={navigasjonKonstanter.forebyggingsplanTab.key} label={navigasjonKonstanter.forebyggingsplanTab.label}/>
                        <Tabs.Tab value={navigasjonKonstanter.fullførteAktiviteterTab.key} label={navigasjonKonstanter.fullførteAktiviteterTab.label}/>
                    </Tabs.List>
                    <Tabs.Panel value={navigasjonKonstanter.aktivitetsOversiktTab.key}>
                        <Aktivitetsmaler aktiviteter={aktiviteter} />
                    </Tabs.Panel>
                    <Tabs.Panel value={navigasjonKonstanter.forebyggingsplanTab.key}>
                        Her kommer {navigasjonKonstanter.forebyggingsplanTab.label}
                    </Tabs.Panel>
                    <Tabs.Panel value={navigasjonKonstanter.fullførteAktiviteterTab.key}>
                        Her kommer {navigasjonKonstanter.fullførteAktiviteterTab.label}
                    </Tabs.Panel>
                </Tabs>
            </main>
        </div>
    );
};

export default Home;
