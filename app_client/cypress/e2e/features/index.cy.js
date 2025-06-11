describe('show features test', () => {

  it('test show features success', () => {
    cy.goto('/features');
    cy.get('[data-testid=features-title]').should('have.contain', "Features");

    cy.urlShould('/features');
  });

});
