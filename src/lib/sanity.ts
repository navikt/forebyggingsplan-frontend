import sanityClient from "@sanity/client";

export const sanity = sanityClient({
    projectId: "2u7e6oll",
    dataset:
        process.env.NODE_ENV === "production" ? "production" : "development",
    apiVersion: "2022-10-28",
    useCdn: process.env.NODE_ENV === "production",
});
