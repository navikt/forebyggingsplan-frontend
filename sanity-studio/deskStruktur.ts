import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { aktivitet } from "./schemas/aktivitet";
import { kategori } from "./schemas/kategori";
import {
    StructureBuilder,
    StructureResolverContext,
} from "sanity/lib/exports/desk";

export const deskStruktur = (
    S: StructureBuilder,
    context: StructureResolverContext
): unknown =>
    S.list()
        .title("Innhold")
        .items([
            orderableDocumentListDeskItem({
                type: "Aktivitet",
                title: aktivitet.title,
                id: "aktivitet-sorterbar-liste",
                S,
                context,
            }),
            orderableDocumentListDeskItem({
                type: "kategori",
                title: kategori.title,
                id: "kategori-sorterbar-liste",
                S,
                context,
            }),
        ]);
