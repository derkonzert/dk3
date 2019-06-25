/// <reference types="cypress" />

describe("Event List", function() {
  before(() => {
    cy.visit("/")
  })

  it("Shows today and tomorrow titles", function() {
    cy.get("h4")
      .first()
      .contains("Today")

    cy.get("h4")
      .eq(1)
      .contains("Tomorrow")
  })

  it("Shows events", () => {
    cy.get("[data-event]")
      .eq(0)
      .contains("Neubauten")

    cy.get("[data-event]").should("have.length.greaterThan", 59)
  })

  it("Renders a legend for different event fancyness levels", () => {
    cy.get("[data-legend]").should("exist")
  })
})
