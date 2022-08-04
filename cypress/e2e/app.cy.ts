describe('Navigasjon', () => {
  it('vi har definert tittel', () => {
    cy.visit('/')
    cy.get("title").contains("Forebyggingsplan")
  })
})
