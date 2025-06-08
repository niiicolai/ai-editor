describe('show products test', () => {

  it('test show products success', () => {
    cy.login();
    cy.wait(2000);
    cy.goto('/products?category=credit');
    cy.get('[data-testid=product-title').should('have.contain', "Choose Your Credit Package");

    cy.urlShould('/products?category=credit');
  });

  it('test show products failure', () => {
    cy.goto('/products?category=credit');
    cy.urlShould('/user/login');
  });

});
