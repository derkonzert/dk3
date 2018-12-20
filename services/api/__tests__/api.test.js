const { ApolloServer } = require("apollo-server-micro")
jest.mock("apollo-server-micro")

let api

describe("api", () => {
  let apolloHandlerMock

  beforeEach(() => {
    apolloHandlerMock = jest.fn()

    ApolloServer.mockImplementation(() => ({
      createHandler: jest.fn().mockReturnValue(apolloHandlerMock),
    }))

    api = require("..")
  })

  it("resets req.url to actual url", async () => {
    const request = { url: "some/url" }
    const response = {}

    await api(request, response)

    expect(request.url).toBe("/api")
    expect(apolloHandlerMock).toHaveBeenCalledWith(request, response)
  })

  // it("passes req and res through to apolloServer handler", async () => {
  //   const req = {}
  //   const response = {}

  //   await api(req, response)

  // })
})
