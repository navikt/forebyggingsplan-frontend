// First, we must import the schema creator

// Then import schema types from any plugins that might expose them
import { aktivitet } from "./aktivitet";
import lovpålagt from "../objects/Lovpålagt";
import video from "../objects/Video";
import { lenke } from "../objects/Lenke";
import { seksjon } from "../objects/Seksjon";
import { kategori } from "./kategori";
import statistikk from "../objects/Statistikk";
import { lesMer } from "../objects/LesMer";
import oppgave from "../objects/Oppgave";

// Then we give our schema to the builder and provide the result to Sanity
export const schemaTypes = [
    lenke,
    seksjon,
    lovpålagt,
    oppgave,
    lesMer,
    video,
    aktivitet,
    kategori,
    statistikk,
];
