describe('show available llms test', () => {

  it('test show available llms success', () => {
    cy.goto('/models');
    cy.get('[data-testid=available-llm-title]').should('have.contain', "Models");

    cy.urlShould('/models');
  });

});
