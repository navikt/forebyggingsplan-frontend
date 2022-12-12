import { Heading, Tag, TagProps } from "@navikt/ds-react";
import { Aktivitet, AktivitetStatus } from "../../types/Aktivitet";
import styles from "./AktivitetHeader.module.css";

const dateformat = new Intl.DateTimeFormat("nb-NO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
});

type ValgteStatuser = Exclude<AktivitetStatus, "IKKE_VALGT">;
const hentTekst = (status: ValgteStatuser, dato: string) => {
    switch (status) {
        case "VALGT":
            return `Aktiviteten har frist ${dato}`;
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

const AktivitetTag = ({
    dato,
    status,
}: {
    dato: string;
    status: ValgteStatuser;
}) => {
    const tekst = hentTekst(status, dato);
    return <Tag variant={TagVariant[status]}>{tekst}</Tag>;
};

export const AktivitetHeader = ({ aktivitet }: { aktivitet: Aktivitet }) => {
    const dato = aktivitet.fullførtTidspunkt || aktivitet.frist;
    return (
        <>
            <Heading level="3" size="small" className={styles.heading}>
                {aktivitet.tittel}
            </Heading>
            {aktivitet.status !== "IKKE_VALGT" && (
                <AktivitetTag
                    dato={dato ? dateformat.format(new Date(dato)) : ""}
                    status={aktivitet.status}
                />
            )}
        </>
    );
};
