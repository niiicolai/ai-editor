describe("editor file tabs test", () => {
  it("test switch between file content using tabs success", () => {
    cy.goto("/");
    cy.get('#drop-down-button-header-file-drop-down').click();
    cy.get('[data-testid=editor-header-new-file-button]').click();
    cy.get(".view-lines").type("Hello1");
    cy.get(".view-lines").should("contain", "Hello1");

    cy.get('#drop-down-button-header-file-drop-down').click();
    cy.get('[data-testid=editor-header-new-file-button]').click();
    cy.get(".view-lines").type("Hello2");
    cy.get(".view-lines").should("contain", "Hello2");

    cy.get('[data-testid=editor-file-tabs]').children().should('have.length', 2);

    cy.get('[data-testid=editor-file-tabs]').children().first().get('[data-testid=editor-file-tab-edit]').click({ multiple: true });

    cy.get(".view-lines").should("contain", "Hello1");
  });

  it("test close tab using tab-button success", () => {
    cy.goto("/");

    cy.get('#drop-down-button-header-file-drop-down').click();
    cy.get('[data-testid=editor-header-new-file-button]').click();
    cy.get(".view-lines").type("Hello");
    cy.get(".view-lines").should("contain", "Hello");

    cy.get('[data-testid=editor-file-tabs]').children().first().get('[data-testid=editor-file-tab-close]').click();

    cy.get(".view-lines").should("not.contain", "Hello");
  });

});
