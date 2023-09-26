import React from "react";
import { StatusType } from "../../components/Oppgave/Oppgave";
import { lagreIaMetrikkInteraksjonstjeneste } from "../klient/ia-metrikker-klient";
import { loggAktivitetStatusMarkert } from "../klient/amplitude-klient";
import { oppdaterStatus } from "../klient/status-klient";

type AktivitetType = "OPPGAVE" | "AKTIVITETSKORT";
export type AktivitetBrukerStatus = {
    aktivitetId: string;
    aktivitetType: AktivitetType;
    status?: StatusType;
};
const AktivitetContext = React.createContext<{
    aktivitetStatuser: AktivitetBrukerStatus[];
    setLokaleEndringer: React.Dispatch<
        React.SetStateAction<{ aktivitetId: string; status: StatusType }[]>
    >;
}>({ aktivitetStatuser: [], setLokaleEndringer: () => {} });

export const AktivitetProvider = ({
    children,
    aktivitetStatuser,
}: {
    children: React.ReactNode;
    aktivitetStatuser: AktivitetBrukerStatus[];
}) => {
    const [lokaleEndringer, setLokaleEndringer] = React.useState<
        { aktivitetId: string; status: StatusType }[]
    >([]);
    const kombinerteAktivitetStatuser = React.useMemo(
        () =>
            aktivitetStatuser.map((aktivitetStatus) => {
                const lokalEndring = lokaleEndringer.find(
                    (endring) =>
                        endring.aktivitetId === aktivitetStatus.aktivitetId,
                );
                if (lokalEndring) {
                    return { ...aktivitetStatus, status: lokalEndring.status };
                }
                return aktivitetStatus;
            }),
        [aktivitetStatuser, lokaleEndringer],
    );
    return (
        <AktivitetContext.Provider
            value={{
                aktivitetStatuser: kombinerteAktivitetStatuser,
                setLokaleEndringer,
            }}
        >
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

export const useOppdaterStatus = (
    orgnr: string | null,
    tittel: string,
    aktivitetId: string,
) => {
    const { setLokaleEndringer } = React.useContext(AktivitetContext);

    return React.useCallback(
        (status: StatusType) => {
            if (orgnr) {
                oppdaterStatus(aktivitetId, orgnr, status);
                loggAktivitetStatusMarkert(aktivitetId, tittel, status);
                lagreIaMetrikkInteraksjonstjeneste(orgnr);

                setLokaleEndringer((tidligereEndringer) => {
                    const aktivitetIndex = tidligereEndringer.findIndex(
                        (endring) => endring.aktivitetId === aktivitetId,
                    );

                    if (aktivitetIndex > -1) {
                        const nyeEndringer = [...tidligereEndringer];
                        nyeEndringer[aktivitetIndex] = {
                            ...tidligereEndringer[aktivitetIndex],
                            aktivitetId,
                            status,
                        };
                        return nyeEndringer;
                    }
                    return [
                        ...tidligereEndringer,
                        { aktivitetId, status, aktivitetType: "OPPGAVE" },
                    ];
                });
            } else {
                console.error("Får ikke oppdatert status. Mangler orgnr.");
            }
        },
        [setLokaleEndringer, orgnr, tittel, aktivitetId],
    );
};
