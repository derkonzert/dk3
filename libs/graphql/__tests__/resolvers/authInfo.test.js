const { authInfo } = require("../../lib/resolvers/authInfo")

describe("authInfo", () => {
  const context = {
    user: {
      some: "fake",
      user: "data",
    },
  }

  it("resolves to the user object set from context", () => {
    expect(authInfo(undefined, undefined, context)).toEqual(context.user)
  })

  it("resolves to null if no user object is set on context", () => {
    expect(authInfo(undefined, undefined, {})).toEqual(null)
  })
})
