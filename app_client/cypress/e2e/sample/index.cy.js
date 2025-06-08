describe('show samples test', () => {

  it('test show samples success', () => {
    cy.login();
    cy.wait(2000);
    cy.goto('/admin/samples');
    cy.get('[data-testid=sample-title]').should('have.contain', "RAG Evaluation Management");

    cy.urlShould('/admin/samples');
  });

  it('test show samples failure', () => {
    cy.goto('/admin/samples');
    cy.urlShould('/user/login');
  });

});
