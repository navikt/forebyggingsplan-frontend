import sanityClient from "@sanity/client";
import { KategoriDokument } from "../pages";
import { SanityClientLike } from "@sanity/image-url/lib/types/types";

interface SanityCli {
    fetch: (query: string) => Promise<KategoriDokument[]>;
}

const sanityConfig = {
    projectId: "2u7e6oll",
    dataset:
        process.env.NODE_ENV === "production" ? "production" : "development",
    apiVersion: "2022-10-28",
    useCdn: process.env.NODE_ENV === "production",
};
export const sanity: SanityCli & SanityClientLike = sanityClient(sanityConfig);

export const sanityLabs: SanityCli = {
    fetch: (query) =>
        fetch(
            `https://${sanityConfig.projectId}.api.sanity.io/v${
                sanityConfig.apiVersion
            }/data/query/production?query=${encodeURIComponent(query)}`
        )
            .then((res) => res.json())
            .then((res) => res.result),
};
