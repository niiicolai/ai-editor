describe('project index test', () => {

  it('test show rag success', () => {
    cy.goto('/project-index');
    cy.get('[data-testid=project-index-title]').should('have.contain', "Project Index");

    cy.urlShould('/project-index');
  });

  it('test go to home success', () => {
    cy.goto('/project-index');

    cy.get('[data-testid=project-index-back-link]').click();
    cy.get('[data-testid=editor-wrapper]').should('exist');
    cy.urlShould('/');
  });
});
