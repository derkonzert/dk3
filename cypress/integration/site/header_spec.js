describe("Header", function() {
  it("Shows project name", function() {
    cy.visit("http://localhost:3000/")

    cy.get("h1").contains("derkonzert")
  })
})
