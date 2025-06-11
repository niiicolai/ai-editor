describe('show docs test', () => {

  it('test show docs success', () => {
    cy.goto('/docs');
    cy.get('[data-testid=docs-title]').should('have.contain', "Documentation");

    cy.urlShould('/docs');
  });

});
