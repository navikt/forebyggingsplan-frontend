describe("Navigasjon", () => {
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
            expect($headers).to.have.length(1);
            expect($headers.eq(0)).to.contain("Alle aktiviteter");
        });

        cy.get("#aktivitetstabell tbody td").should(($datacells) => {
            expect($datacells).to.have.length(4);
            expect($datacells.eq(0)).to.contain(
                "Pilotering av medarbeidersamtalen"
            );
            expect($datacells.eq(1)).to.contain("Kartleggingsmøte med ansatt");
            expect($datacells.eq(2)).to.contain("Sinnemestring");
            expect($datacells.eq(3)).to.contain(
                "Hvordan ta den vanskelige praten?"
            );
        });
    });
});
