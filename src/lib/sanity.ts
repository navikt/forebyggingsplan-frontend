import sanityClient from "@sanity/client";

export const sanity = sanityClient({
    projectId: "2u7e6oll",
    dataset: "production",
    useCdn: process.env.NODE_ENV === "production",
});
