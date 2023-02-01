type AppName = "forebyggingsplan-frontend-mock" | "forebyggingsplan-frontend";
type Miljø = "labs-gcp" | "prod-gcp" | "dev-gcp" | "localhost";

export const isMock = () =>
    (process.env.NAIS_APP_NAME as AppName) === "forebyggingsplan-frontend-mock";

export const isProd = () => (process.env.NAIS_APP_NAME as Miljø) === "prod-gcp";
