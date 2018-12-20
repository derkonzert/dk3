const db = require("@dk3/db")

jest.mock("@dk3/db")

const testUser = { email: "jus@email.com" }

db.userById.mockImplementation(_id => (_id === 123 ? testUser : null))

const { me } = require("../../lib/resolvers/me")

describe("me", () => {
  it("resolves to user when id is given", async () => {
    const user = await me(undefined, undefined, { user: { _id: 123 } })

    expect(user).toEqual(testUser)
  })

  it("resolves to null when no id is given", async () => {
    const user = await me(undefined, undefined, {})

    expect(user).toEqual(null)
  })
})
