/// <reference types="cypress" />

describe("Blocked User", function() {
  before(() => {
    cy.visit("http://localhost:3000/")
  })

  it("is not able to login", function() {
    cy.window().login("belzebub")

    cy.get("header").should("not.contain", "WhoAmI: belzebub")
    cy.get("header").contains("WhoAmI: anonymous")
  })
})
