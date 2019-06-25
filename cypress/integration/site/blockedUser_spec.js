/// <reference types="cypress" />

describe("Blocked User", function() {
  before(() => {
    cy.visit("/")
  })

  it("is not able to login", function() {
    cy.window().login("belzebub")

    cy.get("[data-main-nav]").should("not.contain", "Hi belzebub")
    cy.get("[data-main-nav]").contains("Login")
  })
})
