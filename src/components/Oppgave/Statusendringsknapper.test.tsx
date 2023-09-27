import React from "react";
import { Statusendringsknapper } from "./Statusendringsknapper";
import { render, screen } from "@testing-library/react";
import { loggKnappetrykk } from "../../lib/klient/amplitude-klient";

jest.mock("../../lib/klient/amplitude-klient", () => ({
    ...jest.requireActual("../../lib/klient/amplitude-klient"),
    loggKnappetrykk: jest.fn(),
}));

describe("Statusendringsknapper", () => {
    const oppgavetittel = "Dummyoppgave";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Skal sende ut amplitude-event ved klikk på Start", () => {
        render(
            <Statusendringsknapper
                oppgavetittel={oppgavetittel}
                status={"AVBRUTT"}
                setNyStatus={() => {}}
            />,
        );
        const knapp = screen.getByRole("button", { name: /Start/i });

        expect(loggKnappetrykk).not.toHaveBeenCalled();

        knapp.click();

        expect(loggKnappetrykk).toHaveBeenCalled();
        expect(loggKnappetrykk).toHaveBeenCalledWith("Start", {
            oppgavetittel,
        });
    });

    it("Skal sende ut amplitude-event ved klikk på Fullfør", () => {
        render(
            <Statusendringsknapper
                oppgavetittel={oppgavetittel}
                status={"STARTET"}
                setNyStatus={() => {}}
            />,
        );
        const knapp = screen.getByRole("button", { name: /Fullfør/i });

        expect(loggKnappetrykk).not.toHaveBeenCalled();

        knapp.click();

        expect(loggKnappetrykk).toHaveBeenCalled();
        expect(loggKnappetrykk).toHaveBeenCalledWith("Fullfør", {
            oppgavetittel,
        });
    });

    it("Skal sende ut amplitude-event ved klikk på Avbryt", () => {
        render(
            <Statusendringsknapper
                oppgavetittel={oppgavetittel}
                status={"STARTET"}
                setNyStatus={() => {}}
            />,
        );
        const knapp = screen.getByRole("button", { name: /Avbryt/i });

        expect(loggKnappetrykk).not.toHaveBeenCalled();

        knapp.click();

        expect(loggKnappetrykk).toHaveBeenCalled();
        expect(loggKnappetrykk).toHaveBeenCalledWith("Avbryt", {
            oppgavetittel,
        });
    });

    it("Skal sende ut amplitude-event ved klikk på Tilbakestill", () => {
        render(
            <Statusendringsknapper
                oppgavetittel={oppgavetittel}
                status={"FULLFØRT"}
                setNyStatus={() => {}}
            />,
        );
        const knapp = screen.getByRole("button", { name: /Tilbakestill/i });

        expect(loggKnappetrykk).not.toHaveBeenCalled();

        knapp.click();

        expect(loggKnappetrykk).toHaveBeenCalled();
        expect(loggKnappetrykk).toHaveBeenCalledWith("Tilbakestill", {
            oppgavetittel,
        });
    });
});
