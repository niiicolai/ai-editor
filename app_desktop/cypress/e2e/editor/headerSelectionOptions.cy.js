describe('editor header-selection test', () => {

  it('test header-selection select-all success', () => {
    cy.goto('/');
    cy.get('.view-lines').type("Hello");
    cy.get('.view-lines').should('contain', 'Hello');
    cy.get('#drop-down-button-header-selection-drop-down').click();
    cy.get('[data-testid=editor-header-select-all-button]').click();
    cy.get('#drop-down-button-header-edit-drop-down').click();
    cy.get('[data-testid=editor-header-cut-button]').click();
    cy.get('.view-lines').should('not.contain', 'Hello');
  });

  it('test header-selection close active tab success', () => {
    cy.goto('/');
    cy.get('#drop-down-button-header-file-drop-down').click();
    cy.get('[data-testid=editor-header-new-file-button]').click();
    cy.get('#drop-down-button-header-file-drop-down').click();
    cy.get('[data-testid=editor-header-new-file-button]').click();
    cy.get('[data-testid=editor-file-tabs]').children().should('have.length', 2);

    cy.get('#drop-down-button-header-selection-drop-down').click();
    cy.get('[data-testid=editor-header-close-active-tab-button]').click();
    cy.get('[data-testid=editor-file-tabs]').children().should('have.length', 1);
  });

});
