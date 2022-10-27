import "../styles/globals.css";
import "@navikt/bedriftsmeny/lib/bedriftsmeny.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default MyApp;
