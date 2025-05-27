describe("login test", () => {
  /*it("test login success", () => {
    const username = `random_${Date.now()}`;
    const email = `random_${Date.now()}@example.com`;
    const password = "P@11word";

    cy.signup(username, email, password);

    // Load the login page.
    cy.goto(`/user/login`);

    // Fill in the email information.
    cy.get("[data-testid=email-login-input] input").type(email);
    cy.get("[data-testid=email-login-input] input").should("have.value", email);

    // Fill in the password information.
    cy.get("[data-testid=password-login-input] input").type(password);
    cy.get("[data-testid=password-login-input] input").should(
      "have.value",
      password
    );

    // Click the login button.
    cy.get("[data-testid=login-button]").click();

    cy.urlShould("/user");
  });*/

  it("test login failure", () => {
    cy.goto("/user/login");

    // Fill in the email information.
    cy.get("[data-testid=email-login-input] input").type("wrong@email.com");
    cy.get("[data-testid=email-login-input] input").should(
      "have.value",
      "wrong@email.com"
    );

    // Fill in the password information.
    cy.get("[data-testid=password-login-input] input").type("wrongpassword");
    cy.get("[data-testid=password-login-input] input").should(
      "have.value",
      "wrongpassword"
    );

    // Click the login button.
    cy.get("[data-testid=login-button]").click();

    // Check if the error message is displayed.
    cy.get("[data-testid=login-error").contains("Invalid email or password");
  });
});
