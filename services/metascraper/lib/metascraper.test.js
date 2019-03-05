const metascraper = require("./metascraper")

require("./getMetadata")
jest.mock("./getMetadata")
const { getMetadata } = require("./getMetadata")
require("@dk3/api-utils")
jest.mock("@dk3/api-utils")
const { sendJson } = require("@dk3/api-utils")

describe("metascraper", () => {
  it("calls getMetadata with targetUrl from query parameter", async () => {
    const expectedResult = { foo: "bar" }
    const targetUrl = "test-target-url"
    const res = {}
    getMetadata.mockReturnValue(expectedResult)

    await metascraper({ url: `/?targetUrl=${targetUrl}` }, res)

    expect(getMetadata).toHaveBeenCalledWith(targetUrl)
    expect(sendJson).toHaveBeenCalledWith(res, 200, expectedResult)
  })

  it("sends error when targetUrl is missing", async () => {
    expect.assertions(1)

    const res = {}

    getMetadata.mockImplementation(() => {
      throw new Error("Uh oh")
    })

    await metascraper({ url: "/" }, res)

    expect(sendJson).toHaveBeenCalledWith(res, 400, {
      error: "Uh oh",
    })
  })
})
