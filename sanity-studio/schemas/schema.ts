// First, we must import the schema creator
import createSchema from "part:@sanity/base/schema-creator";

// Then import schema types from any plugins that might expose them
import schemaTypes from "all:part:@sanity/base/schema-type";
import { aktivitet } from "./aktivitet";
import lovpålagt from "../objects/Lovpålagt";
import video from "../objects/Video";
import { lenke } from "../objects/Lenke";
import { seksjon } from "../objects/Seksjon";
import { kategori } from "./kategori";

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
    // We name our schema
    name: "default",
    // Then proceed to concatenate our document type
    // to the ones provided by any plugins that are installed
    types: schemaTypes.concat([
        /* Your types here! */
        lenke,
        seksjon,
        lovpålagt,
        video,
        aktivitet,
        kategori,
    ]),
});
