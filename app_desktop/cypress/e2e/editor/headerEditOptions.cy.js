describe("editor header-edit test", () => {
  it("test header-edit undo success", () => {
    cy.goto("/");
    cy.get(".view-lines").type("Hello");
    cy.get(".view-lines").should("contain", "Hello");

    cy.get("#drop-down-button-header-edit-drop-down").click();
    cy.get("[data-testid=editor-header-undo-button]").click();
    cy.get(".view-lines").should("not.contain", "Hello");
  });

  it("test header-edit redo success", () => {
    cy.goto("/");
    cy.get(".view-lines").type("Hello");
    cy.get(".view-lines").should("contain", "Hello");

    cy.get("#drop-down-button-header-edit-drop-down").click();
    cy.get("[data-testid=editor-header-undo-button]").click();

    cy.get("#drop-down-button-header-edit-drop-down").click();
    cy.get("[data-testid=editor-header-redo-button]").click();

    cy.get(".view-lines").should("contain", "Hello");
  });

  it("test header-edit cut success", () => {
    cy.goto("/");
    cy.get(".view-lines").type("Hello");
    cy.get(".view-lines").should("contain", "Hello");
    cy.get("#drop-down-button-header-selection-drop-down").click();
    cy.get("[data-testid=editor-header-select-all-button]").click();

    cy.get("#drop-down-button-header-edit-drop-down").click();
    cy.get("[data-testid=editor-header-cut-button]").click();
    cy.get(".view-lines").should("not.contain", "Hello");
  });

  it("test header-edit copy and paste success", () => {
    cy.goto("/");
    cy.get(".view-lines").type("Hello");
    cy.get(".view-lines").should("contain", "Hello");
    cy.get("#drop-down-button-header-selection-drop-down").click();
    cy.get("[data-testid=editor-header-select-all-button]").click();

    cy.get("#drop-down-button-header-edit-drop-down").click();
    cy.get("[data-testid=editor-header-copy-button]").click();

    cy.goto("/");

    cy.get("#drop-down-button-header-selection-drop-down").click();
    cy.get("[data-testid=editor-header-select-all-button]").click();

    cy.get("#drop-down-button-header-edit-drop-down").click();
    cy.get("[data-testid=editor-header-paste-button]").click();

    cy.get(".view-lines").should("contain", "Hello");
  });

  it("test header-edit find success", () => {
    cy.goto("/");

    cy.get("#drop-down-button-header-edit-drop-down").click();
    cy.get("[data-testid=editor-header-find-button]").click();
    cy.get("[data-testid=editor-header-search-close-button]").click();
  });
});
