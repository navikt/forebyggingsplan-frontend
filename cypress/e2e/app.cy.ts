// @ts-ignore
describe("Navigasjon", () => {
    Cypress.Cookies.debug(true);
    it("vi har definert sidetittel", () => {
        cy.visit("/");
        cy.get("title").contains("Forebyggingsplan");
    });

    it("vi har definert overskrift for aktivitetsoversikten", () => {
        cy.visit("/");

        cy.get("h1").contains("Forebyggingsplan");
    });

    it("vi har en tabell som viser alle aktvitetsmalene", () => {
        cy.visit("/");
        cy.get("#aktivitetstabell thead th").should(($headers) => {
            expect($headers).to.have.length(3);
            expect($headers.eq(0)).to.contain("Alle aktiviteter");
            expect($headers.eq(1)).to.contain("Legg til");
        });

        cy.get("#aktivitetstabell tbody td").should(($datacells) => {
            expect($datacells).to.have.length(16);
            expect($datacells.eq(0)).to.contain(
                "Pilotering av medarbeidersamtalen"
            );
            expect($datacells.eq(4)).to.contain("Kartleggingsmøte med ansatt");
            expect($datacells.eq(8)).to.contain("Sinnemestring");
            expect($datacells.eq(12)).to.contain(
                "Hvordan ta den vanskelige praten?"
            );
            expect($datacells.eq(1).children(".navds-button")).to.exist;
        });
    });
});
