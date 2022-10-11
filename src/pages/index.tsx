import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Aktivitet } from "../types/Aktivitet";
import { Aktivitetsmaler } from "../components/Aktivitetsmaler";
import { FOREBYGGINGSPLAN_API_BASEURL } from "../constants";
import { Tabs } from "@navikt/ds-react";
import { ValgtAktivitet } from "../types/ValgtAktivitet";
import { MinPlan } from "../components/MinPlan";
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

        const [aktiviteterRespons, valgteAktiviteterRespons] =
            await Promise.all([
                fetch(`${FOREBYGGINGSPLAN_API_BASEURL}/aktivitetsmaler`, {
                    headers: {
                        Authorization: `Bearer ${tokenxToken}`,
                    },
                }),
                fetch(
                    `${FOREBYGGINGSPLAN_API_BASEURL}/valgteaktiviteter/811076732`,
                    {
                        headers: {
                            Authorization: `Bearer ${tokenxToken}`,
                        },
                    }
                ),
            ]);
        return {
            props: {
                aktiviteter: await aktiviteterRespons.json(),
                valgteAktiviteter: await valgteAktiviteterRespons.json(),
            },
        };
    } catch (e) {
        console.error(JSON.stringify(e));
        return {
            props: {
                aktiviteter: [],
                valgteAktiviteter: [],
            },
        };
    }
};

const navigasjonKonstanter = {
    aktiviteterTab: {
        label: "Aktiviteter",
        key: "aktiviteter",
    },
    minPlanTab: {
        label: "Min plan",
        key: "minPlan",
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
                        defaultValue={navigasjonKonstanter.aktiviteterTab.key}
                        size="medium"
                    >
                        <Tabs.List>
                            <Tabs.Tab
                                value={navigasjonKonstanter.aktiviteterTab.key}
                                label={
                                    navigasjonKonstanter.aktiviteterTab.label
                                }
                            />
                            <Tabs.Tab
                                value={navigasjonKonstanter.minPlanTab.key}
                                label={navigasjonKonstanter.minPlanTab.label}
                            />
                        </Tabs.List>
                        <Tabs.Panel
                            value={navigasjonKonstanter.aktiviteterTab.key}
                        >
                            <Aktivitetsmaler aktiviteter={aktiviteter} />
                        </Tabs.Panel>
                        <Tabs.Panel value={navigasjonKonstanter.minPlanTab.key}>
                            <MinPlan valgteAktiviteter={valgteAktiviteter} />
                        </Tabs.Panel>
                    </Tabs>
                </main>
            </div>
        </>
    );
};

export default Home;
