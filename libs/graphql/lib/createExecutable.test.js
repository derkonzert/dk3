const gqlTools = require("graphql-tools")

jest.mock("graphql-tools")

const createExecutable = require("../lib/createExecutable")

describe("createExecutable", () => {
  beforeEach(() => {
    gqlTools.makeExecutableSchema = jest.fn()
  })

  it("calls makeExecutableSchema with resolvers, typeDefinition and other all properties", () => {
    const typeDefs = {}
    const resolvers = {}
    const other = {}

    createExecutable({ typeDefs, resolvers, other })

    expect(gqlTools.makeExecutableSchema).toBeCalledWith(
      expect.objectContaining({
        typeDefs,
        resolvers,
        other,
      })
    )
  })
})
