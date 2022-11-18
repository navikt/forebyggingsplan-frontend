import { sanity } from "./sanity";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(sanity);

export function urlFor(source: string) {
    return builder.image(source);
}
