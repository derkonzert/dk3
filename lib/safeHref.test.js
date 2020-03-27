import { safeHref } from "./safeHref"

describe("safeHref", () => {
  it("handles javascript", () => {
    expect(safeHref("javascript:alert('XSS')")).toBe("")
    expect(safeHref(" javascript: alert('XSS')")).toBe("")
  })

  it("uses encodeURI", () => {
    // eslint-disable-next-line quotes
    expect(safeHref('https://some.domain" onclick="alert(\'XSS\')"')).toBe(
      "https://some.domain%22%20onclick=%22alert('XSS')%22"
    )
  })
})
