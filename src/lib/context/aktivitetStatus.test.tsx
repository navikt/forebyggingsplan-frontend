import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { lagreIaMetrikkInteraksjonstjeneste } from "../klient/ia-metrikker-klient";
import { loggAktivitetStatusMarkert } from "../klient/amplitude-klient";
import {
    AktivitetProvider,
    useAktivitetStatuser,
    useStatusForAktivitet,
    useOppdaterStatus,
    AktivitetBrukerStatus,
} from "./aktivitetStatus";

jest.mock("../klient/ia-metrikker-klient", () => ({
    ...jest.requireActual("../klient/ia-metrikker-klient"),
    lagreIaMetrikkInformasjonstjeneste: jest.fn(),
    lagreIaMetrikkInteraksjonstjeneste: jest.fn(),
}));

jest.mock("../klient/amplitude-klient", () => ({
    ...jest.requireActual("../klient/amplitude-klient"),
    loggAktivitetStatusMarkert: jest.fn(),
}));

const renderMedAktivitetProvider = (
    children: React.ReactNode,
    aktivitetStatuser: AktivitetBrukerStatus[] = [],
) => {
    return render(
        <AktivitetProvider aktivitetStatuser={aktivitetStatuser}>
            {children}
        </AktivitetProvider>,
    );
};

function AktivitetStatuserConsumer() {
    const { aktivitetStatuser } = useAktivitetStatuser();
    return aktivitetStatuser.map((aktivitetStatus) => (
        <div key={aktivitetStatus.aktivitetId}>
            {aktivitetStatus.aktivitetId}: {aktivitetStatus.status}
        </div>
    ));
}

function AktivitetForStatusConsumer({
    aktivitetsId,
}: {
    aktivitetsId: string;
}) {
    const status = useStatusForAktivitet(aktivitetsId);
    return (
        <div>
            {aktivitetsId}: {status}
        </div>
    );
}

function AktivitetStatusOppdaterer({
    aktivitetId,
    tittel,
}: {
    aktivitetId: string;
    tittel: string;
}) {
    const oppdaterStatus = useOppdaterStatus("12341234", tittel, aktivitetId);
    return (
        <>
            <button onClick={() => oppdaterStatus("AVBRUTT")}>
                Sett {aktivitetId} til AVBRUTT
            </button>
            <button onClick={() => oppdaterStatus("STARTET")}>
                Sett {aktivitetId} til STARTET
            </button>
            <button onClick={() => oppdaterStatus("FULLFØRT")}>
                Sett {aktivitetId} til FULLFØRT
            </button>
        </>
    );
}

describe("AktivitetStatus", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Får ut statuser fra useAktivitetStatuser", () => {
        renderMedAktivitetProvider(<AktivitetStatuserConsumer />, [
            { aktivitetId: "1", status: "FULLFØRT" },
            { aktivitetId: "2", status: "STARTET" },
            { aktivitetId: "3", status: "AVBRUTT" },
        ]);
        expect(screen.getByText("1: FULLFØRT")).toBeInTheDocument();
        expect(screen.getByText("2: STARTET")).toBeInTheDocument();
        expect(screen.getByText("3: AVBRUTT")).toBeInTheDocument();
    });

    it("Får ut status for aktivitet fra useStatusForAktivitet", () => {
        renderMedAktivitetProvider(
            <AktivitetForStatusConsumer aktivitetsId="1" />,
            [{ aktivitetId: "1", status: "FULLFØRT" }],
        );
        expect(screen.getByText("1: FULLFØRT")).toBeInTheDocument();
        expect(screen.queryByText("2: STARTET")).not.toBeInTheDocument();
    });

    it("Får ut oppdatert status for aktivitet med eksisterende status", async () => {
        renderMedAktivitetProvider(
            <>
                <AktivitetForStatusConsumer aktivitetsId="1" />
                <AktivitetStatusOppdaterer
                    aktivitetId="1"
                    tittel="Aktivitet 1"
                />
            </>,
            [{ aktivitetId: "1", status: "FULLFØRT" }],
        );
        expect(screen.getByText("1: FULLFØRT")).toBeInTheDocument();
        expect(screen.queryByText("1: STARTET")).not.toBeInTheDocument();
        expect(screen.queryByText("1: AVBRUTT")).not.toBeInTheDocument();

        const settTilStartetKnapp = screen.getByText("Sett 1 til STARTET");
        expect(settTilStartetKnapp).toBeInTheDocument();
        settTilStartetKnapp.click();
        await waitFor(() => {
            expect(screen.getByText("1: STARTET")).toBeInTheDocument();
        });
        expect(screen.queryByText("1: FULLFØRT")).not.toBeInTheDocument();
        expect(screen.queryByText("1: AVBRUTT")).not.toBeInTheDocument();
    });

    it("Får ut oppdatert status for aktivitet uten eksisterende status", async () => {
        renderMedAktivitetProvider(
            <>
                <AktivitetForStatusConsumer aktivitetsId="1" />
                <AktivitetStatusOppdaterer
                    aktivitetId="1"
                    tittel="Aktivitet 1"
                />
            </>,
        );
        expect(screen.getByText("1:")).toBeInTheDocument();
        expect(screen.queryByText("1: STARTET")).not.toBeInTheDocument();

        const settTilStartetKnapp = screen.getByText("Sett 1 til STARTET");
        expect(settTilStartetKnapp).toBeInTheDocument();
        settTilStartetKnapp.click();
        await waitFor(() => {
            expect(screen.getByText("1: STARTET")).toBeInTheDocument();
        });
        expect(screen.queryByText("1:")).not.toBeInTheDocument();
    });

    it("Sender metrikk ved oppdatering av status", async () => {
        renderMedAktivitetProvider(
            <AktivitetStatusOppdaterer aktivitetId="1" tittel="Aktivitet 1" />,
        );
        const settTilStartetKnapp = screen.getByText("Sett 1 til STARTET");
        expect(settTilStartetKnapp).toBeInTheDocument();
        expect(lagreIaMetrikkInteraksjonstjeneste).not.toHaveBeenCalled();
        expect(loggAktivitetStatusMarkert).not.toHaveBeenCalled();
        settTilStartetKnapp.click();
        await waitFor(() => {
            expect(lagreIaMetrikkInteraksjonstjeneste).toHaveBeenCalledTimes(1);
        });
        await waitFor(() => {
            expect(loggAktivitetStatusMarkert).toHaveBeenCalledTimes(1);
        });

        expect(lagreIaMetrikkInteraksjonstjeneste).toHaveBeenCalledWith(
            "12341234",
        );
        expect(loggAktivitetStatusMarkert).toHaveBeenCalledWith(
            "1",
            "Aktivitet 1",
            "STARTET",
        );
    });
});
