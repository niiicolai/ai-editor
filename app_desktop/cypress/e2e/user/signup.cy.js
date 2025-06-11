describe('signup test', () => {

  it('test signup success', () => {
    cy.goto('/user/signup');
    
    const username = `random_${Date.now()}`;
    const email = `random_${Date.now()}@example.com`;
    const password = 'P@11word';

    // Fill in the username information.
    cy.get('[data-testid=username-signup-input] input').type(username);
    cy.get('[data-testid=username-signup-input] input').should('have.value', username);

    // Fill in the email information.
    cy.get('[data-testid=email-signup-input] input').type(email);
    cy.get('[data-testid=email-signup-input] input').should('have.value', email);

    // Fill in the password information.
    cy.get('[data-testid=password-signup-input] input').type(password);
    cy.get('[data-testid=password-signup-input] input').should('have.value', password);

    // Click the signup button.
    cy.get('[data-testid=signup-button]').click();

    cy.urlShould('/');
  });

  it('test signup failure', () => {
    cy.goto('/user/signup');

    cy.fixture('user').then(({ email, password }) => {

        // Fill in the username information.
        const username = `random_${Date.now()}`;
        cy.get('[data-testid=username-signup-input] input').type(username);
        cy.get('[data-testid=username-signup-input] input').should('have.value', username);

        // Fill in the email information.
        cy.get('[data-testid=email-signup-input] input').type(email);
        cy.get('[data-testid=email-signup-input] input').should('have.value', email);

        // Fill in the password information.
        cy.get('[data-testid=password-signup-input] input').type(password);
        cy.get('[data-testid=password-signup-input] input').should('have.value', password);

        // Click the signup button.
        cy.get('[data-testid=signup-button]').click();

        // Check if the error message is displayed.
        cy.get('[data-testid=signup-error').contains('email already exists');
    });
  });

});
