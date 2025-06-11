describe('edit user test', () => {

  it('test edit user success', () => {
    cy.login();
    cy.wait(2000);

    cy.fixture('user').then(({ username, email, password }) => {
        cy.get('[data-testid=profile-username]').should('have.contain', username);
        cy.goto('/user/edit');

        // Fill in the username information.
        cy.get('[data-testid=username-edit-input] input').clear();
        cy.get('[data-testid=username-edit-input] input').type(username);
        cy.get('[data-testid=username-edit-input] input').should('have.value', username);

        // Fill in the email information.
        cy.get('[data-testid=email-edit-input] input').clear();
        cy.get('[data-testid=email-edit-input] input').type(email);
        cy.get('[data-testid=email-edit-input] input').should('have.value', email);

        // Fill in the password information.
        cy.get('[data-testid=password-edit-input] input').clear();
        cy.get('[data-testid=password-edit-input] input').type(password);
        cy.get('[data-testid=password-edit-input] input').should('have.value', password);

        // Click the signup button.
        cy.get('[data-testid=edit-submit-button]').click();

        cy.urlShould('/user');
    });
  });

  it('test edit user success on clear', () => {
    cy.login();
    cy.wait(2000);

    cy.fixture('user').then(({ username }) => {
        cy.get('[data-testid=profile-username]').should('have.contain', username);
        cy.goto('/user/edit');

        // Fill in the username information.
        cy.get('[data-testid=username-edit-input] input').clear();

        // Fill in the email information.
        cy.get('[data-testid=email-edit-input] input').clear();

        // Fill in the password information.
        cy.get('[data-testid=password-edit-input] input').clear();

        // Click the signup button.
        cy.get('[data-testid=edit-submit-button]').click();

        cy.urlShould('/user');
    });
  });

});
