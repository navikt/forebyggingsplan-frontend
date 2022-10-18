import { PortableTextBlock } from "@portabletext/types";

export interface Aktivitet {
    tittel: string;
    beskrivelse: string;
    mål: string;
    innhold: PortableTextBlock[];
}
