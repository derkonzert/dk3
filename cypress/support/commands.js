/// <reference types="cypress" />
// ***********************************************
// This example commands.js shows you how to
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
Cypress.Commands.add(
  "login",
  { prevSubject: ["window"] },
  (subject, username) =>
    cy
      .request({
        method: "post",
        url: "http://localhost:8004/api/auth/signIn",
        body: {
          email: `${username}s@email.com`,
          password: `${username}spassword`,
        },
        failOnStatusCode: false,
      })
      .then(resp => {
        if (resp.body.accessToken) {
          return cy.setCookie("token", resp.body.accessToken)
        }
      })
      .then(() => {
        subject.__apolloClient__.resetStore()
      })
)

Cypress.Commands.add("logout", { prevSubject: ["window"] }, subject => {
  cy.clearCookie("token")

  return subject.__apolloClient__.resetStore()
})
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
