import type {NextPage} from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {Table} from '@navikt/ds-react'

const Home: NextPage = () => {
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

                <Table size="medium" id={"aktivitetstabell"}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell scope="col">
                                Alle aktiviteter
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.DataCell scope="col">
                                Aktivitet 1
                            </Table.DataCell>
                        </Table.Row>

                        <Table.Row>
                            <Table.DataCell scope="col">
                                Aktivitet 2
                            </Table.DataCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.DataCell scope="col">
                                Aktivitet 3
                            </Table.DataCell>
                        </Table.Row>
                    </Table.Body>
                </Table>

            </main>
        </div>
    )
}

export default Home
