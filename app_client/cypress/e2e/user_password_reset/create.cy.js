describe('create user password reset test', () => {

  it('test create success', () => {
    cy.goto('/user/password-reset');

    cy.get('[data-testid=email-user-password-reset-input] input').type("email@example.com");
    cy.get('[data-testid=email-user-password-reset-input] input').should('have.value', "email@example.com");

    // Click the reset button.
    cy.get('[data-testid=user-password-reset-create-button]').click();
  });

  it('test create failure', () => {
    cy.goto('/user/password-reset');

    // Fill in the email information.
    cy.get('[data-testid=email-user-password-reset-input] input').type("wrong@email.com");
    cy.get('[data-testid=email-user-password-reset-input] input').should('have.value', "wrong@email.com");

    // Click the reset button.
    cy.get('[data-testid=user-password-reset-create-button]').click();

    // Check if the error message is displayed.
    cy.get('[data-testid=user-password-reset-create-error').contains('user not found');
  });

});
