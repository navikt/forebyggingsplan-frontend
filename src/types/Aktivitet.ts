import { PortableTextBlock } from "@portabletext/types";

export interface Aktivitet {
    id: string;
    tittel: string;
    beskrivelse: string;
    mål: string;
    innhold: PortableTextBlock[];
}
