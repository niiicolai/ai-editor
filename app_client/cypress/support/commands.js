/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// A method for handling login and goto by base url.
// Inspired by https://github.com/OliverRoat/kea_car_frontend/blob/main/cypress/support/commands.js

Cypress.Commands.add('login', () => {
    cy.fixture('config').then(({ baseURL }) => {
        cy.fixture('user').then(({ email, password }) => {
            // Load the login page.
            cy.visit(`${baseURL}/user/login`);

            // Fill in the email information.
            cy.get('[data-testid=email-login-input] input').type(email);
            cy.get('[data-testid=email-login-input] input').should('have.value', email);

            // Fill in the password information.
            cy.get('[data-testid=password-login-input] input').type(password);
            cy.get('[data-testid=password-login-input] input').should('have.value', password);

            // Click the login button.
            cy.get('[data-testid=login-button]').click();
        });
    });
})

Cypress.Commands.add('goto', (path) => {
    cy.fixture('config').then(({ baseURL }) => {
        cy.visit(`${baseURL}${path}`);
    });
})

Cypress.Commands.add('urlShould', (path) => {
    cy.fixture('config').then(({ baseURL }) => {
        cy.url().should('eq', `${baseURL}${path}`);
    });
})
