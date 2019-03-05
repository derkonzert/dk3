const metascraper = require("metascraper")
jest.mock("metascraper")
const got = require("got")
jest.mock("got")

const { getMetadata } = require("./getMetadata")

describe("getMetadata", () => {
  let metascraperMock = jest.fn()

  beforeEach(() => {
    got.mockResolvedValue({ body: "html", url: "url" })

    metascraperMock.mockReset()

    metascraper.mockImplementation(() => metascraperMock)
  })

  it("throws when targetUrl is falsy", () => {
    expect.assertions(1)

    return expect(getMetadata()).rejects.toThrow()
  })

  it("throws when targetUrl is empty string", () => {
    expect.assertions(1)

    return expect(getMetadata(" ")).rejects.toThrow()
  })

  it("throws when got request fails", () => {
    expect.assertions(1)

    got.mockImplementation(() => {
      throw new Error("Uh oh")
    })

    return expect(getMetadata("some-url")).rejects.toThrow("Uh oh")
  })

  it("makes got call to given targetUrl", async () => {
    await getMetadata("some-url")

    expect(got).toHaveBeenCalledWith("some-url")
  })

  it("calls metascraper with result from got", async () => {
    await getMetadata("some-url")

    expect(metascraperMock).toHaveBeenCalledWith({ html: "html", url: "url" })
  })

  it("return result from metascraper", async () => {
    const expectedResult = Symbol.for("getMetadata.test")

    metascraperMock.mockReturnValue(expectedResult)

    const result = await getMetadata("some-url")

    expect(result).toBe(expectedResult)
  })
})
