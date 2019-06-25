/// <reference types="cypress" />
const faker = require("faker")

const fakeEventData = () => ({
  title: faker.name.firstName(),
  location: faker.company.companyName(),
  url: faker.internet.url(),
})

describe("Add event", function() {
  let event

  before(() => {
    event = fakeEventData()

    cy.visit("/")

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
    cy.get("[name='title']").type(event.title)
    cy.get("input#location").type(`${event.location}`)

    cy.wait(500)

    cy.get("input#location").type("{enter}")

    cy.get("[name='url']").type(event.url)

    cy.get("[data-add-event-form]").submit()

    cy.get("[data-event-title]").contains(event.title)
    cy.get(`[href='${event.url}']`).should("exist")
  })

  it("Navigating back, brings the user back to the list and hides the detail", () => {
    cy.go("back")

    cy.wait(500)

    cy.get("[data-side='true']").should("not.exist")
  })

  it("adds the new event to the event list", () => {
    cy.get("[data-event]").contains(event.title)
  })
})
