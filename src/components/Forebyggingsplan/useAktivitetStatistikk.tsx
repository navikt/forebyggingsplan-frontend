import React from "react";
import { Aktivitet } from "../../types/Aktivitet";
import {
    useAktivitetStatuser,
    AktivitetBrukerStatus,
} from "../../lib/aktivitet-klient";

export type AktivitetStatistikkType = {
    ferdige: number;
    påbegynte: number;
    ikkeStartet: number;
    totalt: number;
};

export function useAktivitetStatistikk(
    aktivitet: Aktivitet,
): AktivitetStatistikkType {
    const { aktivitetStatuser } = useAktivitetStatuser();

    return React.useMemo(() => {
        return byggAktivitetStatistikk(aktivitet, aktivitetStatuser);
    }, [aktivitet, aktivitetStatuser]);
}
function byggAktivitetStatistikk(
    aktivitet: Aktivitet,
    aktivitetStatuser: AktivitetBrukerStatus[],
) {
    const aktivitetIDer = finnAktivitetIderFraSanityObjekt(
        aktivitet as aktivitetIteratorType,
    );

    return aktivitetIDer.reduce(
        (accumulator, id) => {
            accumulator.totalt++;

            switch (
                aktivitetStatuser
                    ?.find(
                        (aktivitetStatus) => aktivitetStatus.aktivitetId === id,
                    )
                    ?.status?.toUpperCase()
            ) {
                case "FULLFØRT":
                    accumulator.ferdige++;
                    return accumulator;
                case "STARTET":
                    accumulator.påbegynte++;
                    return accumulator;
                case "AVBRUTT":
                default:
                    return accumulator;
            }
        },
        { ferdige: 0, påbegynte: 0, ikkeStartet: 0, totalt: 0 },
    );
}
type aktivitetIteratorType = {
    id?: string;
    oppgavetype?: string;
    innhold?: aktivitetIteratorType[];
    children?: aktivitetIteratorType[];
};
function finnAktivitetIderFraSanityObjekt(
    aktivitet: aktivitetIteratorType,
): string[] {
    console.log("aktivitet :>> ", aktivitet);
    const lokaleIDer: string[] = [];
    if (aktivitet?.oppgavetype?.startsWith("Oppgave") && aktivitet?.id) {
        lokaleIDer.push(aktivitet.id);
    }

    if (aktivitet?.innhold?.length && aktivitet?.innhold?.length > 0) {
        aktivitet.innhold.forEach((innhold) => {
            lokaleIDer.push(...finnAktivitetIderFraSanityObjekt(innhold));
        });
    }

    if (aktivitet?.children?.length && aktivitet?.children?.length > 0) {
        aktivitet.children.forEach((child) => {
            lokaleIDer.push(...finnAktivitetIderFraSanityObjekt(child));
        });
    }

    return lokaleIDer;
}
