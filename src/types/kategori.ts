import {Aktivitet} from "./Aktivitet";

export interface Kategori {
    tittel: string;
    beskrivelse: string;
    aktiviteter: Aktivitet[];
}