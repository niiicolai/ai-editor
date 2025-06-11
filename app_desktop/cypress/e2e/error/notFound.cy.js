describe('show not found test', () => {

  it('test show not found success', () => {
    cy.goto('/not_a_real_path');
    cy.get('[data-testid=error-title]').should('have.contain', "Oops! Page Not Found");

    cy.urlShould('/not_a_real_path');
  });

  it('test go to home success', () => {
    cy.goto('/not_a_real_path');

    cy.get('[data-testid=error-back-link]').click();
    cy.get('[data-testid=editor-wrapper]').should('exist');
    cy.urlShould('/');
  });
});
