type AppName = "forebyggingsplan-frontend-mock" | "forebyggingsplan-frontend";

export const isMock = () =>
    (process.env.NAIS_APP_NAME as AppName) === "forebyggingsplan-frontend-mock";
