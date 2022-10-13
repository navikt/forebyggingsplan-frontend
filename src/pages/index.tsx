import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Aktivitet } from "../types/Aktivitet";
import { FOREBYGGINGSPLAN_API_BASEURL } from "../constants";
import { ValgtAktivitet } from "../types/ValgtAktivitet";
import { hentToken } from "../auth";
import { veksleToken } from "../auth/tokenx";
import { verifiserToken } from "../auth/idporten";
import { ForebyggingsplanFaner } from "../components/Forebyggingsplan/ForebyggingsplanFaner";
import Layout from "../components/Layout/Layout";

interface Props {
    aktiviteter: Aktivitet[];
    valgteAktiviteter: ValgtAktivitet[];
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
        console.log("aktiviteter-response", aktiviteterRespons);
        console.log("json", await aktiviteterRespons.json());
        return {
            props: {
                aktiviteter: await aktiviteterRespons.json(),
                valgteAktiviteter: await valgteAktiviteterRespons.json(), // TODO hent klientside
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

interface ForsideProps {
    aktiviteter: Aktivitet[];
    valgteAktiviteter: ValgtAktivitet[];
}

function Forside({ aktiviteter, valgteAktiviteter }: ForsideProps) {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>Forebyggingsplan</h1>
                <ForebyggingsplanFaner
                    aktiviteter={aktiviteter}
                    valgteAktiviteter={valgteAktiviteter}
                />
            </main>
        </div>
    );
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
            <Layout>
                <Forside
                    aktiviteter={aktiviteter}
                    valgteAktiviteter={valgteAktiviteter}
                />
            </Layout>
        </>
    );
};

export default Home;
