describe('show user test', () => {

  it('test show user success', () => {
    cy.login();

    cy.get('[data-testid=profile-username]').should('have.contain', "username");

    cy.urlShould('/user');
  });

  it('test show user failure', () => {
    cy.goto('/user');
    cy.urlShould('/user/login');
  });

});
