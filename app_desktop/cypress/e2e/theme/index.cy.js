describe('themes test', () => {

  it('test show themes success', () => {
    cy.goto('/themes');
    cy.get('[data-testid=themes-title]').should('have.contain', "Themes");

    cy.urlShould('/themes');
  });

  it('test change themes success', () => {
    cy.goto('/themes');

    cy.get('[data-testid=select-theme-Cyber-Drift]').click();

    cy.get('[data-testid=active-theme-Cyber-Drift]').should('exist');

    cy.urlShould('/themes');
  });

  it('test go to home success', () => {
    cy.goto('/themes');

    cy.get('[data-testid=themes-back-link]').click();
    cy.get('[data-testid=editor-wrapper]').should('exist');
    cy.urlShould('/');
  });
});
