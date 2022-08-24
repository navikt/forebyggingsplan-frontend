import type { NextPage, NextPageContext } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Aktivitet } from "../types/Aktivitet";
import { Aktivitetsmaler } from "../components/Aktivitetsmaler";
import { FOREBYGGINGSPLAN_API_BASEURL } from "../constants";
import { Tabs } from "@navikt/ds-react";
import { ValgtAktivitet } from "../types/ValgtAktivitet";
import { Plan } from "../components/Plan";

export async function getServerSideProps(context: NextPageContext) {
    const aktiviteterRespons = await fetch(
        `${FOREBYGGINGSPLAN_API_BASEURL}/aktivitetsmaler`
    );
    const valgteAktiviteterRespons = await fetch(
        `${FOREBYGGINGSPLAN_API_BASEURL}/valgteaktiviteter/123456789`
    );
    return {
        props: {
            aktiviteter: await aktiviteterRespons.json(),
            valgteAktiviteter: await valgteAktiviteterRespons.json(),
        },
    };
}

const navigasjonKonstanter = {
    aktivitetsOversiktTab: {
        label: "Oversikt",
        key: "aktiviteter",
    },
    forebyggingsplanTab: {
        label: "Plan",
        key: "plan",
    },
    fullførteAktiviteterTab: {
        label: "Fullførte aktiviteter",
        key: "fullførteAktiviteter",
    },
};

interface Props {
    aktiviteter: Aktivitet[];
    valgteAktiviteter: ValgtAktivitet[];
}

const Home: NextPage<Props> = ({ aktiviteter, valgteAktiviteter }) => {
    console.log(aktiviteter);
    console.log(valgteAktiviteter);
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
            <div className={styles.container}>
                <main className={styles.main}>
                    <h1 className={styles.title}>Forebyggingsplan</h1>
                    <Tabs
                        defaultValue={
                            navigasjonKonstanter.aktivitetsOversiktTab.key
                        }
                        size="medium"
                    >
                        <Tabs.List>
                            <Tabs.Tab
                                value={
                                    navigasjonKonstanter.aktivitetsOversiktTab
                                        .key
                                }
                                label={
                                    navigasjonKonstanter.aktivitetsOversiktTab
                                        .label
                                }
                            />
                            <Tabs.Tab
                                value={
                                    navigasjonKonstanter.forebyggingsplanTab.key
                                }
                                label={
                                    navigasjonKonstanter.forebyggingsplanTab
                                        .label
                                }
                            />
                            <Tabs.Tab
                                value={
                                    navigasjonKonstanter.fullførteAktiviteterTab
                                        .key
                                }
                                label={
                                    navigasjonKonstanter.fullførteAktiviteterTab
                                        .label
                                }
                            />
                        </Tabs.List>
                        <Tabs.Panel
                            value={
                                navigasjonKonstanter.aktivitetsOversiktTab.key
                            }
                        >
                            <Aktivitetsmaler aktiviteter={aktiviteter} />
                        </Tabs.Panel>
                        <Tabs.Panel
                            value={navigasjonKonstanter.forebyggingsplanTab.key}
                        >
                            <Plan valgteAktiviteter={valgteAktiviteter} />
                        </Tabs.Panel>
                        <Tabs.Panel
                            value={
                                navigasjonKonstanter.fullførteAktiviteterTab.key
                            }
                        >
                            <p>
                                Her kommer{" "}
                                {
                                    navigasjonKonstanter.fullførteAktiviteterTab
                                        .label
                                }
                            </p>
                        </Tabs.Panel>
                    </Tabs>
                </main>
            </div>
        </>
    );
};

export default Home;
