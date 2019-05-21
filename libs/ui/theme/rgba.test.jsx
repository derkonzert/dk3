import { rgba } from "./rgba"

describe("rgba", () => {
  it("throws with invalid hex", () => {
    expect(() => rgba("#8f")).toThrow()
    expect(() => rgba("#8fnfalekfmsf8aef")).toThrow()
  })

  it("throws when rgb or rgba is given", () => {
    expect(() => rgba("rgb(12,31,41)")).toThrow()
    expect(() => rgba("rgba(12,31,41, 0.8)")).toThrow()
  })

  it("treats missing alpha argument as 100% opaque", () => {
    expect(rgba("#000")).toEqual("rgba(0, 0, 0, 1)")
  })

  it("generates rgba for hex without alpha channel", () => {
    expect(rgba("#000", 80)).toEqual("rgba(0, 0, 0, 0.8)")
    expect(rgba("#0000FF", 80)).toEqual("rgba(0, 0, 255, 0.8)")
  })

  it("generates rgba for hex with alpha channel", () => {
    expect(rgba("#0000")).toEqual("rgba(0, 0, 0, 0)")
    expect(rgba("#0000FF00")).toEqual("rgba(0, 0, 255, 0)")
  })
})
