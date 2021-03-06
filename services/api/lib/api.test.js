const dk3Graphql = require("@dk3/graphql")
jest.mock("@dk3/graphql")

const db = require("@dk3/db")
jest.mock("@dk3/db")

const apiUtils = require("@dk3/api-utils")
jest.mock("@dk3/api-utils")
apiUtils.sendJson = jest.fn()

const libContext = require("../lib/createGraphQlContext")
jest.mock("../lib/createGraphQlContext")

const fakeSchema = Symbol.for("fake.schema")

dk3Graphql.createExecutable = jest.fn().mockReturnValue(fakeSchema)

const api = require("./api")

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
      contextValue = undefined
      req = {
        body: requestBody,
      }
      res = {
        writeHead: jest.fn(),
        end: jest.fn(),
      }
      dk3Graphql.graphql.mockReset()
      apiUtils.sendJson.mockReset()

      libContext.createGraphQlContext.mockImplementation(() => contextValue)
    })

    it("establishes db connection (once)", async () => {
      req.body = {}
      db.connect.mockReturnValue(true)

      await api(req, res)
      await api(req, res)

      expect(db.connect).toHaveBeenCalledTimes(1)
    })

    it("fails when no query is set", async () => {
      req.body = {}

      await api(req, res)

      expect(apiUtils.sendJson).toHaveBeenCalledWith(res, 400, {
        message: api.queryMissingMessage,
      })
    })

    it("fast exists when no query is set", async () => {
      req.body = {}

      await api(req, res)
      expect(dk3Graphql.graphql).not.toBeCalled()
    })

    it("calls graphql-js", async () => {
      contextValue = Symbol.for("fake.context")
      req.body = {
        query: "{ some { gqlQuery }}",
        variables: [{ foo: "bar" }],
        operation: "someName",
      }

      await api(req, res)

      const expectedRootValue = expect.objectContaining({})

      expect(dk3Graphql.graphql).toBeCalledWith(
        fakeSchema,
        req.body.query,
        expectedRootValue,
        contextValue,
        req.body.variables,
        req.body.operation
      )
    })

    it("catches graphql-js errors", async () => {
      const expectedErrorMessage = "Ooops something went wrong"

      req.body = {
        query: "{ some { gqlQuery }}",
      }

      dk3Graphql.graphql.mockImplementation(() => {
        throw new Error(expectedErrorMessage)
      })

      await api(req, res)

      expect(apiUtils.sendJson).toBeCalledWith(res, 500, {
        error: expectedErrorMessage,
      })
    })

    it("supports multiple queries per request", async () => {
      contextValue = Symbol.for("fake.context")
      req.body = [
        {
          query: "{ some { gqlQuery }}",
          variables: [{ foo: "bar" }],
          operation: "someName",
        },
        {
          query: "{ some { gqlQuery }}",
          variables: [{ foo: "bar" }],
          operation: "someName",
        },
      ]

      await api(req, res)

      const expectedRootValue = expect.objectContaining({})

      expect(dk3Graphql.graphql).toHaveBeenCalledTimes(req.body.length)

      req.body.forEach(requestBodyPart => {
        expect(dk3Graphql.graphql).toBeCalledWith(
          fakeSchema,
          requestBodyPart.query,
          expectedRootValue,
          contextValue,
          requestBodyPart.variables,
          requestBodyPart.operation
        )
      })
    })
  })
})
