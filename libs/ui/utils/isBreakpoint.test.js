import { getMatchMedia, isBreakpoint, isTablet } from "./isBreakpoint"

describe("isBreakpoint", () => {
  describe("getMatchMedia", () => {
    it("returns matchMedia object for given query", () => {
      const result = getMatchMedia("my query")

      expect(result.media).toBe("my query")
    })

    it("memoizes matchMedia objects per query", () => {
      const result1 = getMatchMedia("my query")
      const result2 = getMatchMedia("my query")
      const result3 = getMatchMedia("my other query")

      expect(result1).toBe(result2)
      expect(result1).not.toBe(result3)
    })
  })

  describe("isBreakpoint", () => {
    it("returns the matched value of the mediaQuery object", () => {
      window.matchMedia.mockReturnValueOnce({
        matches: true,
      })

      expect(isBreakpoint("some")).toBe(true)

      window.matchMedia.mockReturnValueOnce({
        matches: false,
      })

      expect(isBreakpoint("some other")).toBe(false)
    })

    describe("with window undefined", () => {
      let origWindow

      beforeEach(() => {
        origWindow = window
        window = undefined // eslint-disable-line
      })

      afterEach(() => {
        window = origWindow // eslint-disable-line
      })

      it("returns false", () => {
        expect(isBreakpoint("anything")).toBe(false)
        expect(isBreakpoint("anythingelse")).toBe(false)
      })
    })
  })

  describe("isTablet", () => {
    it("calls isBreakpoint with tablet media query", () => {
      isTablet()

      expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 48em)")
    })
  })
})
