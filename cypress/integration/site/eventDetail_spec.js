/// <reference types="cypress" />

const testEvent = {
  title: "Mock Einstürzende Neubauten",
}

describe("Event List", function() {
  before(() => {
    cy.visit("/")

    cy.contains(testEvent.title).click()
  })

  it("Shows title", function() {
    cy.get("[data-event-title]")
      .first()
      .contains(testEvent.title)
  })

  // it("has a valid og:image link", done => {
  //   cy.get("[property='og:image']")
  //     .invoke("attr", "content")
  //     .then(ogImageUrl => {
  //       return cy.request(ogImageUrl)
  //     })
  //     .then(response => {
  //       expect(response.status).to.be.equal(200)
  //       expect(response.headers["content-type"]).to.be.equal("image/png")
  //       done()
  //     })
  // })
})
