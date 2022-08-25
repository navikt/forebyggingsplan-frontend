describe("Navigasjon", () => {
    it("vi har definert sidetittel", () => {
        cy.visit("/", {
            retryOnStatusCodeFailure: true,
            retryOnNetworkFailure: true,
        });
        cy.get("title").contains("Forebyggingsplan");
    });

    it("vi har definert overskrift for aktivitetsoversikten", () => {
        cy.visit("/", {
            retryOnStatusCodeFailure: true,
            retryOnNetworkFailure: true,
        });
        cy.get("h1").contains("Forebyggingsplan");
    });

    it("vi har en tabell som viser alle aktvitetsmalene", () => {
        cy.visit("/", {
            retryOnStatusCodeFailure: true,
            retryOnNetworkFailure: true,
        });
        cy.get("#aktivitetstabell thead th").should(($headers) => {
            expect($headers).to.have.length(2);
            expect($headers.eq(0)).to.contain("Alle aktiviteter");
            expect($headers.eq(1)).to.contain("Legg til");
        });

        cy.get("#aktivitetstabell tbody td").should(($datacells) => {
            expect($datacells).to.have.length(8);
            expect($datacells.eq(0)).to.contain(
                "Pilotering av medarbeidersamtalen"
            );
            expect($datacells.eq(2)).to.contain("Kartleggingsmøte med ansatt");
            expect($datacells.eq(4)).to.contain("Sinnemestring");
            expect($datacells.eq(6)).to.contain(
                "Hvordan ta den vanskelige praten?"
            );
            expect($datacells.eq(1).children(".navds-button")).to.exist;
        });
    });
});
