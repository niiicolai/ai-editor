describe('editor header-view test', () => {

  it('test header-view go to themes success', () => {
    cy.goto('/');
    cy.get('#drop-down-button-header-view-drop-down').click();
    cy.get('[data-testid=editor-header-themes-button]').click();
    cy.urlShould('/themes');
  });

  it('test header-view go to shortcuts success', () => {
    cy.goto('/');
    cy.get('#drop-down-button-header-view-drop-down').click();
    cy.get('[data-testid=editor-header-shortcuts-button]').click();
    cy.urlShould('/shortcuts');
  });

  it('test header-view go to rag settings success', () => {
    cy.goto('/');
    cy.get('#drop-down-button-header-view-drop-down').click();
    cy.get('[data-testid=editor-header-rag-button]').click();
    cy.urlShould('/rag');
  });

  it('test header-view hide explorer success', () => {
    cy.viewport(1025, 1080); // Must be greater than 1024 for the explorer to be a sidebar
    cy.goto('/');
    cy.get('[data-testid=editor-explorer-wrapper]').should('be.visible');
    cy.get('#drop-down-button-header-view-drop-down').click();
    cy.get('[data-testid=editor-header-hide-explorer-button]').click();
    cy.get('[data-testid=editor-explorer-wrapper]').should('not.be.visible');
  });

  it('test header-view hide agent success', () => {
    cy.viewport(1025, 1080); // Must be greater than 1024 for the explorer to be a sidebar
    cy.goto('/');
    cy.get('[data-testid=editor-agent-wrapper]').should('be.visible');
    cy.get('#drop-down-button-header-view-drop-down').click();
    cy.get('[data-testid=editor-header-hide-agent-button]').click();
    cy.get('[data-testid=editor-agent-wrapper]').should('not.be.visible');
  });

  it('test header-view disable terminal success', () => {
    cy.goto('/');
    cy.get('[data-testid=editor-terminal-wrapper]').should('exist');
    cy.get('#drop-down-button-header-view-drop-down').click();
    cy.get('[data-testid=editor-header-disable-terminal-button]').click();
    cy.get('[data-testid=editor-terminal-wrapper]').should('not.exist');
  });

  it('test header-view enable terminal success', () => {
    cy.goto('/');
    cy.get('[data-testid=editor-terminal-wrapper]').should('exist');
    cy.get('#drop-down-button-header-view-drop-down').click();
    cy.get('[data-testid=editor-header-disable-terminal-button]').click();
    cy.get('[data-testid=editor-terminal-wrapper]').should('not.exist');
    cy.get('#drop-down-button-header-view-drop-down').click();
    cy.get('[data-testid=editor-header-disable-terminal-button]').click();
    cy.get('[data-testid=editor-terminal-wrapper]').should('exist');
  });

  it('test header-view hide terminal success', () => {
    cy.goto('/');
    cy.get('[data-testid=editor-terminal-wrapper]').should('exist');
    cy.get('#drop-down-button-header-view-drop-down').click();
    cy.get('[data-testid=editor-header-hide-terminal-button]').click();
    cy.get('[data-testid=editor-terminal-wrapper]').should('not.exist');
    cy.get('[data-testid=editor-terminal-minimized]').should('exist');
  });

  it('test header-view show terminal success', () => {
    cy.goto('/');
    cy.get('[data-testid=editor-terminal-wrapper]').should('exist');
    cy.get('#drop-down-button-header-view-drop-down').click();
    cy.get('[data-testid=editor-header-hide-terminal-button]').click();
    cy.get('[data-testid=editor-terminal-wrapper]').should('not.exist');
    cy.get('[data-testid=editor-terminal-minimized]').should('exist');
    cy.get('#drop-down-button-header-view-drop-down').click();
    cy.get('[data-testid=editor-header-hide-terminal-button]').click();
    cy.get('[data-testid=editor-terminal-minimized]').should('not.exist');
    cy.get('[data-testid=editor-terminal-wrapper]').should('exist');
  });

  it('test header-view new terminal success', () => {
    cy.goto('/');
    cy.get('[data-testid=editor-terminal-tabs]').children().should('have.length', 1);
    cy.get('[data-testid=editor-terminal-wrapper]').should('exist');
    cy.get('#drop-down-button-header-view-drop-down').click();
    cy.get('[data-testid=editor-header-new-terminal-button]').click();
    cy.get('[data-testid=editor-terminal-tabs]').children().should('have.length', 2);
  });

});
