const metascraper = require("./metascraper")

describe("metascraper", () => {
  it("exposes a lambda handler", () => {
    expect(metascraper).toBeInstanceOf(Function)

    const end = jest.fn()
    metascraper(null, { end })
    expect(end).toHaveBeenCalledWith("ignore for now")
  })
})
