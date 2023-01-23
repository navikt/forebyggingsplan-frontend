import { Tag, TagProps } from "@navikt/ds-react";
import { Aktivitet, AktivitetStatus } from "../../types/Aktivitet";
import styles from "./AktivitetHeader.module.css";
import { norskDatoformat } from "../../lib/dato";

type ValgteStatuser = Exclude<AktivitetStatus, "IKKE_VALGT">;
const hentTekst = (status: ValgteStatuser, dato: string) => {
    switch (status) {
        case "VALGT":
            return `Dette vil vi gjøre ${dato && "innen " + dato}`;
        case "FULLFØRT":
            return `Dette er utført ${dato}`;
    }
};

const TagVariant: {
    [key in ValgteStatuser]: Extract<
        TagProps["variant"],
        "success" | "warning"
    >;
} = {
    FULLFØRT: "success",
    VALGT: "warning",
};

interface AktivitetTagProps {
    dato: string;
    status: ValgteStatuser;
    className: string;
}

const AktivitetTag = ({ dato, status, ...rest }: AktivitetTagProps) => {
    const tekst = hentTekst(status, dato);
    return (
        <Tag variant={TagVariant[status]} {...rest}>
            {tekst}
        </Tag>
    );
};

export const AktivitetHeader = ({ aktivitet }: { aktivitet: Aktivitet }) => {
    const dato = aktivitet.fullførtTidspunkt || aktivitet.frist;
    return (
        <>
            {aktivitet.tittel}
            {aktivitet.status !== "IKKE_VALGT" && (
                <AktivitetTag
                    dato={dato ? norskDatoformat.format(new Date(dato)) : ""}
                    status={aktivitet.status}
                    className={styles.aktivitetTag}
                />
            )}
        </>
    );
};
