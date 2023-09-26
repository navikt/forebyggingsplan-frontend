import React from "react";
import useSWR from "swr";
import { StatusType } from "../components/Oppgave/Oppgave";

// context for å hente statuser
type AktivitetType = "OPPGAVE" | "AKTIVITETSKORT";
export type AktivitetBrukerStatus = {
    aktivitetId: string;
    aktivitetType: AktivitetType;
    status?: StatusType;
};
export const AktivitetContext = React.createContext<{
    aktivitetStatuser: AktivitetBrukerStatus[];
}>({ aktivitetStatuser: [] });

export const AktivitetProvider = ({
    children,
    aktivitetStatuser,
}: {
    children: React.ReactNode;
    aktivitetStatuser: AktivitetBrukerStatus[];
}) => {
    return (
        <AktivitetContext.Provider value={{ aktivitetStatuser }}>
            {children}
        </AktivitetContext.Provider>
    );
};

export const useAktivitetStatuser = () => {
    const { aktivitetStatuser } = React.useContext(AktivitetContext);

    return { aktivitetStatuser };
};

export const useStatusForAktivitet = (id: string) => {
    const { aktivitetStatuser } = React.useContext(AktivitetContext);

    return aktivitetStatuser?.find((status) => status.aktivitetId === id)
        ?.status;
};

export const useHentAktiviteter = (orgnr: string | null) => {
    return useSWR<AktivitetBrukerStatus[]>(
        `/forebyggingsplan/api/aktiviteter/orgnr/${orgnr}`,
    );
};
