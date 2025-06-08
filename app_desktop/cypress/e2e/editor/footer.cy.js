describe('editor footer test', () => {

  it('test footer go to themes success', () => {
    cy.goto('/');
    cy.get('[data-testid=editor-footer-themes-button]').click();
    cy.urlShould('/themes');
  });

  it('test footer change language success', () => {
    cy.goto('/');
    cy.get('#drop-down-button-footer-language-drop-down').click();
    cy.get('[data-testid=editor-footer-lang-select-button-javascript]').click();
    cy.get('#drop-down-button-footer-language-drop-down').should('contain', 'javascript');
  });

  it('test footer change tab size success', () => {
    cy.goto('/');
    cy.get('#drop-down-button-footer-indent-drop-down').click();
    cy.get('[data-testid=editor-footer-tab-select-button-4]').click();
    cy.get('#drop-down-button-footer-indent-drop-down').should('contain', '4');
  });

  it('test footer show credit details after login success', () => {
    cy.login();
    cy.wait(1000);
    cy.get('[data-testid=editor-footer-credit-info]').should('contain', 'Credit Left:');
  });

});
