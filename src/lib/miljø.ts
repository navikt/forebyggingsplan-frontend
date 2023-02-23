type AppName = "forebyggingsplan-frontend-mock" | "forebyggingsplan-frontend";
type Miljø = "labs-gcp" | "prod-gcp" | "dev-gcp" | "localhost";

export const isMock = () =>
    (process.env.NAIS_APP_NAME as AppName) === "forebyggingsplan-frontend-mock";

export const isDev = () =>
    (process.env.NAIS_CLUSTER_NAME as Miljø) === "dev-gcp";
