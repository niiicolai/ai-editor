describe('show jobs test', () => {

  it('test show jobs success', () => {
    cy.login();
    cy.wait(2000);
    cy.goto('/admin/jobs');
    cy.get('[data-testid=job-title]').should('have.contain', "Job Management");

    cy.urlShould('/admin/jobs');
  });

  it('test show jobs failure', () => {
    cy.goto('/admin/jobs');
    cy.urlShould('/user/login');
  });

});
