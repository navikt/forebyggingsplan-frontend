type AppName = "forebyggingsplan-frontend-mock" | "forebyggingsplan-frontend";
type Miljø = "labs-gcp" | "prod-gcp" | "dev-gcp" | "localhost";

export interface AltinnKonfig {
    host: string;
    serviceEdition: string;
    serviceCode: string;
}

export const isMock = () =>
    (process.env.NAIS_APP_NAME as AppName) === "forebyggingsplan-frontend-mock";

export const isDev = () =>
    (process.env.NAIS_CLUSTER_NAME as Miljø) === "dev-gcp";

export const isLocalhost = () =>
    (process.env.NAIS_CLUSTER_NAME as Miljø) === "localhost";

export const getAltinnKonfig = (): AltinnKonfig => {
    console.log("NAIS CLUSTER NAME: ", process.env.NAIS_CLUSTER_NAME);
    const altinnHost =
        isDev() || isLocalhost() ? "tt02.altinn.no" : "altinn.no";
    const serviceEdition = isDev() || isLocalhost() ? "1" : "2";
    const serviceCode = "3403";

    return {
        host: altinnHost,
        serviceEdition: serviceEdition,
        serviceCode: serviceCode,
    };
};
