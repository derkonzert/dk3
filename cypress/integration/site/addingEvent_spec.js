/// <reference types="cypress" />

describe("Add event", function() {
  before(() => {
    cy.visit("http://localhost:3000/")

    // Initially the event list has to be available.
    // Otherwise, the list can't be updated with the
    // freshly added event
    cy.get("[data-event]")
  })

  it("Shows the form when add button is clicked", function() {
    cy.get("[data-add-event]").click()

    cy.get("[data-add-event-form]").should("exist")
  })

  it("Navigates to new event, after successful submittion", () => {
    cy.get("[name='title']").type("This Awesome Band")
    cy.get("[name='location']").type("A nice venue")

    cy.get("[data-add-event-form]").submit()

    cy.get("[data-side='true'] h1").contains("This Awesome Band")
  })

  it("Navigating back, brings the user back to the list and hides the detail", () => {
    cy.go("back")

    cy.wait(500)

    cy.get("[data-side='true']").should("not.exist")
  })

  it("adds the new event to the event list", () => {
    cy.get("[data-event]").contains("This Awesome Band")
  })
})
