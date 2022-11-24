import "../styles/globals.css";
import "@navikt/bedriftsmeny/lib/bedriftsmeny.css";
import type { AppProps } from "next/app";
import { fetcher } from "../lib/forebyggingsplan-klient";
import { SWRConfig } from "swr";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <SWRConfig
            value={{
                fetcher,
            }}
        >
            <Component {...pageProps} />
        </SWRConfig>
    );
}

export default MyApp;
