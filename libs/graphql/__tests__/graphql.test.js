const { GraphQLSchema } = require("graphql")
const graphql = require("../lib/graphql")

describe("graphql", () => {
  it("needs exports typeDefs", () => {
    expect(graphql.typeDefs).toBeTruthy()
  })

  it("needs exports createExecutable", () => {
    expect(graphql.createExecutable).toBeTruthy()
  })

  it("needs exports resolvers", () => {
    expect(graphql.resolvers).toBeTruthy()
  })

  it("can create a schema", () => {
    const schema = graphql.createExecutable({
      typeDefs: graphql.typeDefs,
      resolvers: graphql.resolvers,
    })

    expect(schema).toBeInstanceOf(GraphQLSchema)
  })
})
