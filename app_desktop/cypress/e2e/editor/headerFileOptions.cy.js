describe('editor header-file test', () => {

  it('test header-file new file success', () => {
    cy.goto('/');
    cy.get('#drop-down-button-header-file-drop-down').click();
    cy.get('[data-testid=editor-header-new-file-button]').click();
    cy.get('#drop-down-button-header-file-drop-down').click();
    cy.get('[data-testid=editor-header-new-file-button]').click();
    cy.get('[data-testid=editor-file-tabs]').children().should('have.length', 2);
  });

  it('test header-file go to login success', () => {
    cy.goto('/');
    cy.get('#drop-down-button-header-file-drop-down').click();
    cy.get('[data-testid=editor-header-login-button]').click();
    cy.urlShould('/user/login');
  });

  it('test header-file go to signup success', () => {
    cy.goto('/');
    cy.get('#drop-down-button-header-file-drop-down').click();
    cy.get('[data-testid=editor-header-signup-button]').click();
    cy.urlShould('/user/signup');
  });
});
