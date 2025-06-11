describe('show pricing test', () => {

  it('test show pricing success', () => {
    cy.goto('/pricing');
    cy.get('[data-testid=pricing-title').should('have.contain', "Buy Credits & Use the AI Assistant");

    cy.urlShould('/pricing');
  });

});
