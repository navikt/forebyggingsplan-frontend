// @ts-ignore
import { waitFor } from "@testing-library/dom";

describe("Navigasjon", () => {
    beforeEach(() => {
        cy.visit("/");
    });
    it("vi har definert sidetittel", async () => {
        cy.document().then((doc) => {
            expect(doc.title).to.be("Forebyggingsplan");
        });
    });

    it("vi har definert overskrift for aktivitetsoversikten", () => {
        cy.get("#aktivitetstabell").should("exist");
    });

    it("vi har en tabell som viser alle aktvitetsmalene", async () => {
        await waitFor(() => {
            cy.findByText("Pilotering av medarbeidersamtalen").should("exist");
            cy.findByText("Alle aktiviteter").should("exist");
        });
    });
});
