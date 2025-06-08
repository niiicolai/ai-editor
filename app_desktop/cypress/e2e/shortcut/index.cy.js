describe('shortcuts test', () => {

  it('test show shortcuts success', () => {
    cy.goto('/shortcuts');
    cy.get('[data-testid=shortcuts-title]').should('have.contain', "Shortcuts");

    cy.urlShould('/shortcuts');
  });

  it('test go to home success', () => {
    cy.goto('/shortcuts');

    cy.get('[data-testid=shortcuts-back-link]').click();
    cy.get('[data-testid=editor-wrapper]').should('exist');
    cy.urlShould('/');
  });
});
