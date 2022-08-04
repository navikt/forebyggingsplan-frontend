describe('Navigasjon', () => {

    it('vi har definert sidetittel', () => {
        cy.visit('/')
        cy.get("title").contains("Forebyggingsplan")
    })

    it('vi har definert overskrift for aktivitetsoversikten', () => {
        cy.visit('/')
        cy.get("h1").contains("Forebyggingsplan")
    })

    it('vi har en tabell som viser alle aktvitetsmalene', () => {
        cy.visit('/')
        cy.get("#aktivitetstabell th")
            .should(($headers) => {
                expect($headers).to.have.length(1)
                expect($headers.eq(0)).to.contain('Alle aktiviteter')
            })

        cy.get("#aktivitetstabell td")
            .should(($datacells) => {
                expect($datacells).to.have.length(3)
                expect($datacells.eq(0)).to.contain('Aktivitet 1')
                expect($datacells.eq(1)).to.contain('Aktivitet 2')
                expect($datacells.eq(2)).to.contain('Aktivitet 3')
            })
    })

})
