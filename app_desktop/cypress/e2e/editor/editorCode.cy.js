describe("editor code test", () => {
  it("test should be able to type success", () => {
    cy.goto("/");
    cy.get(".view-lines").type("Hello");
    cy.get(".view-lines").should("contain", "Hello");
  });

});
