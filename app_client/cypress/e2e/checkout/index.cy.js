describe('show checkouts test', () => {

  it('test show checkouts success', () => {
    cy.login();
    cy.wait(2000);
    cy.goto('/checkouts?state=purchased');
    cy.get('[data-testid=checkouts-title]').should('have.contain', "Checkout History");

    cy.urlShould('/checkouts?state=purchased');
  });

  it('test show checkouts failure', () => {
    cy.goto('/checkouts?state=purchased');
    cy.urlShould('/user/login');
  });

});
