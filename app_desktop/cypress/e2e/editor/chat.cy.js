describe('editor chat test', () => {
  it('test show login button if not authorized success', () => {
    cy.goto("/")
    cy.get('[data-testid=editor-chat-unauthorized]').should('not.visible');
    cy.get('[data-testid=editor-header-res-show-agent]').click();
    cy.get('[data-testid=editor-chat-unauthorized]').should('exist');
  });

  it('test hide user session after login success', () => {
    cy.login();
    cy.wait(1000);
    cy.get('[data-testid=editor-user-sessions-create-button]').should('not.visible');
    cy.get('[data-testid=editor-header-res-show-agent]').click();
    cy.get('[data-testid=editor-user-sessions-create-button]').should('exist');
    cy.get('[data-testid=editor-header-res-show-agent]').click();
    cy.get('[data-testid=editor-user-sessions-create-button]').should('not.visible');
  });

});
