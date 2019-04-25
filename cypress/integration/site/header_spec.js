/// <reference types="cypress" />

describe("Header", function() {
  before(() => {
    cy.visit("http://localhost:3000/")
  })

  it("Shows project name", function() {
    cy.get("h1").contains("derkonzert")
  })
})
