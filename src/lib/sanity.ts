import sanityClient from "@sanity/client";

export const sanity = sanityClient({
    projectId: "2u7e6oll",
    dataset: "production",
    apiVersion: "2022-10-28",
    useCdn: process.env.NODE_ENV === "production",
});
