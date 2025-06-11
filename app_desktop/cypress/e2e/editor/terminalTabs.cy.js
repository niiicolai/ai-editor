describe("editor terminal tabs test", () => {
  it("test create new tab success", () => {
    cy.goto("/");
    cy.get('[data-testid=editor-terminal-tabs]').children().should('have.length', 1);
    cy.get('[data-testid=editor-terminal-new-tab-button]').click();
    cy.get('[data-testid=editor-terminal-tabs]').children().should('have.length', 2);
  });

  it("test hide terminal success", () => {
    cy.goto("/");

    cy.get('[data-testid=editor-terminal-wrapper]').should('exist');
    cy.get('[data-testid=editor-terminal-hide-terminal-button]').click();
    cy.get('[data-testid=editor-terminal-wrapper]').should('not.exist');
    cy.get('[data-testid=editor-terminal-minimized]').should('exist');
  });

  it("test close tab using tab-button success", () => {
    cy.goto("/");

    cy.get('[data-testid=editor-terminal-tabs]').children().should('have.length', 1);
    cy.get('[data-testid=editor-terminal-new-tab-button]').click();
    cy.get('[data-testid=editor-terminal-tabs]').children().should('have.length', 2);

    cy.get('[data-testid=editor-terminal-tabs]').children().first().find('[data-testid=editor-terminal-remove-button]').click();
    
    cy.get('[data-testid=editor-terminal-tabs]').children().should('have.length', 1);
  });

});
