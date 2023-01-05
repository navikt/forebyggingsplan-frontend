type Miljø = "labs-gcp" | "prod-gcp" | "dev-gcp" | "localhost";

export const isLabs = () =>
    (process.env.NAIS_CLUSTER_NAME as Miljø) === "labs-gcp";
