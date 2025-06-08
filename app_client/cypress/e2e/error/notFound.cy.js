describe('show not found test', () => {

  it('test show not found success', () => {
    cy.goto('/not_a_real_path');
    cy.get('[data-testid=error-title]').should('have.contain', "Oops! Page Not Found");

    cy.urlShould('/not_a_real_path');
  });

});
