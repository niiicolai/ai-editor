describe('show transactions test', () => {

  it('test show transactions success', () => {
    cy.login();
    cy.wait(2000);
    cy.goto('/admin/transactions');
    cy.get('[data-testid=transaction-title]').should('have.contain', "Transaction Management");

    cy.urlShould('/admin/transactions');
  });

  it('test show transactions failure', () => {
    cy.goto('/admin/transactions');
    cy.urlShould('/user/login');
  });

});
