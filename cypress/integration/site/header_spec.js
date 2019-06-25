/// <reference types="cypress" />

describe("Header", function() {
  before(() => {
    cy.visit("/")
  })

  it("Shows project name", function() {
    cy.get("h1").contains("derkonzert")
  })
})
