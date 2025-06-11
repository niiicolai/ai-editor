describe('user destroy test', () => {

  it('test user destroy success', () => {
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

    cy.wait(2000);
    cy.goto('/user/delete');

    // Fill in the username information.
    cy.get('[data-testid=username-destroy-input] input').type(username);
    cy.get('[data-testid=username-destroy-input] input').should('have.value', username);

    // Click the destroy button.
    cy.get('[data-testid=destroy-submit-button]').click();

    cy.urlShould('/');
  });

  it('test user destroy failure', () => {
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

    cy.wait(2000);
    cy.goto('/user/delete');

    // Fill in the username information.
    cy.get('[data-testid=username-destroy-input] input').clear();

    // Click the destroy button.
    cy.get('[data-testid=destroy-submit-button]').click();

    cy.get('[data-testid=destroy-error').contains('The given username didn\'t match your current username');
  });

});
