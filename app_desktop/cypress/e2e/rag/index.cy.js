describe('rag test', () => {

  it('test show rag success', () => {
    cy.goto('/rag');
    cy.get('[data-testid=rag-title]').should('have.contain', "RAG Settings");

    cy.urlShould('/rag');
  });

  it('test go to home success', () => {
    cy.goto('/rag');

    cy.get('[data-testid=rag-back-link]').click();
    cy.get('[data-testid=editor-wrapper]').should('exist');
    cy.urlShould('/');
  });
});
