/// <reference types="cypress" />

describe("Approve Event", function() {
  beforeEach(() => {
    cy.visit("/")

    cy.get("[data-event-approved='false']")
      .first()
      .click()
  })

  it("is not available to anonymous user", function() {
    cy.contains("Approve").should("not.exist")
  })

  it("is not available for normal user", () => {
    cy.window().login("pierre")

    cy.contains("Approve").should("not.exist")
  })

  it("is available for admin users", () => {
    cy.window().login("ju")

    cy.contains("Approve").should("exist")
  })

  it("marks the given event as approved", () => {
    cy.window().login("ju")

    cy.contains("Approve").click()

    cy.contains("Event has not yet been checked").should("not.exist")
  })
})
