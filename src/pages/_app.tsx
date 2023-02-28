import "../styles/globals.css";
import "@navikt/bedriftsmeny/lib/bedriftsmeny.css";
import type { AppProps } from "next/app";
import { fetcher } from "../lib/forebyggingsplan-klient";
import { SWRConfig } from "swr";
import { useEffect } from "react";
import { init } from "@amplitude/analytics-browser";
import { isMock } from "../lib/miljø";
import { server } from "../mocks/msw";

if (isMock() && typeof window === "undefined") {
    console.log("-------------                     -------------");
    console.log("------------- MOCK server starter -------------");
    console.log("-------------                     -------------");
    server.listen();
}

function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        init("default", undefined, {
            useBatch: true,
            serverUrl: "https://amplitude.nav.no/collect-auto",
            attribution: { disabled: true }, // Skrur av Web Attribution Tracking: https://www.docs.developers.amplitude.com/data/sdks/marketing-analytics-browser/#web-attribution
            ingestionMetadata: { sourceName: window.location.toString() }, // This is a hack to provide collect-auto with the correct environment, won't be used within amplitude
        });
    }, []);
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
