const micro = require("micro")
jest.mock("micro")

const dk3Graphql = require("@dk3/graphql")
jest.mock("@dk3/graphql")

const libContext = require("../lib/createGraphQlContext")
jest.mock("../lib/createGraphQlContext")

const fakeSchema = Symbol.for("fake.schema")

dk3Graphql.createExecutable = jest.fn().mockReturnValue(fakeSchema)

const api = require("..")

describe("api", () => {
  it("creates a schema without being called", () => {
    expect(dk3Graphql.createExecutable).toHaveBeenCalledWith(
      expect.objectContaining({
        resolvers: dk3Graphql.resolvers,
        typeDefs: dk3Graphql.typeDefs,
      })
    )
  })

  describe("lambda", () => {
    let req, res, requestBody, contextValue

    beforeEach(() => {
      requestBody = undefined
      contextValue = undefined
      req = {}
      res = {
        status: jest.fn(),
        json: jest.fn(),
        end: jest.fn(),
      }
      micro.json.mockImplementation(() => requestBody)
      libContext.createGraphQlContext.mockImplementation(() => contextValue)
    })

    it("fails when no query is set", async () => {
      requestBody = {}

      await api(req, res)

      expect(res.status).toBeCalledWith(400)
      expect(res.end).toBeCalledWith(api.queryMissingMessage)
    })

    it("fast exists when no query is set", async () => {
      requestBody = {}

      await api(req, res)
      expect(dk3Graphql.graphql).not.toBeCalled()
    })

    it("calls graphql-js", async () => {
      contextValue = Symbol.for("fake.context")
      requestBody = {
        query: "{ some { gqlQuery }}",
        variables: [{ foo: "bar" }],
        operation: "someName",
      }

      await api(req, res)

      const expectedRootValue = expect.objectContaining({})

      expect(dk3Graphql.graphql).toBeCalledWith(
        fakeSchema,
        requestBody.query,
        expectedRootValue,
        contextValue,
        requestBody.variables,
        requestBody.operation
      )
    })

    it("catches graphql-js errors", async () => {
      const expectedErrorMessage = "Ooops something went wrong"

      requestBody = {
        query: "{ some { gqlQuery }}",
      }

      dk3Graphql.graphql.mockImplementation(() => {
        throw new Error(expectedErrorMessage)
      })

      await api(req, res)

      expect(res.status).toBeCalledWith(500)
      expect(res.json).toBeCalledWith(
        expect.objectContaining({
          error: expectedErrorMessage,
        })
      )
    })
  })
})
