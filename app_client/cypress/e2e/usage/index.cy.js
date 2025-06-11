describe('show usage test', () => {

  it('test show usage success', () => {
    cy.login();
    cy.wait(2000);
    cy.goto('/usage');
    cy.get('[data-testid=usage-title]').should('have.contain', "LLM Usage");

    cy.urlShould('/usage');
  });

  it('test show usage failure', () => {
    cy.goto('/usage');
    cy.urlShould('/user/login');
  });

});
