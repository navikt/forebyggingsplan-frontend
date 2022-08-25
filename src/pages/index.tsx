import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Aktivitet } from "../types/Aktivitet";
import { Aktivitetsmaler } from "../components/Aktivitetsmaler";
import { FOREBYGGINGSPLAN_API_BASEURL } from "../constants";
import { Tabs } from "@navikt/ds-react";
import { ValgtAktivitet } from "../types/ValgtAktivitet";
import { Plan } from "../components/Plan";
import { hentToken } from "../auth";
import { veksleToken } from "../auth/tokenx";
import { verifiserToken } from "../auth/idporten";

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
        const tokenxToken = await veksleToken(
            token,
            process.env.FOREBYGGINGSPLAN_CLIENT_ID!!
        );
        const aktiviteterRespons = await fetch(
            `${FOREBYGGINGSPLAN_API_BASEURL}/aktivitetsmaler`,
            {
                headers: {
                    Authorization: `Bearer ${tokenxToken}`,
                },
            }
        );
        const valgteAktiviteterRespons = await fetch(
            `${FOREBYGGINGSPLAN_API_BASEURL}/valgteaktiviteter/123456789`,
            {
                headers: {
                    Authorization: `Bearer ${tokenxToken}`,
                },
            }
        );
        return {
            props: {
                aktiviteter: await aktiviteterRespons.json(),
                valgteAktiviteter: await valgteAktiviteterRespons.json(),
            },
        };
    } catch (e) {
        console.log(JSON.stringify(e));
        return {
            redirect: {
                destination: "/404",
                permanent: false,
            },
        };
    }
};

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

const Home = ({
    aktiviteter,
    valgteAktiviteter,
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
