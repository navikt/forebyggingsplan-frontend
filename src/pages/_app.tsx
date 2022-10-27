import "../styles/globals.css";
import "@navikt/bedriftsmeny/lib/bedriftsmeny.css";
import type { AppProps } from "next/app";

import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default MyApp;
