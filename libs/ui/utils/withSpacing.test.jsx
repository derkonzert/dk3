import React from "react"

import { mount } from "enzyme"
import { matchers } from "jest-emotion"

import { withSpacing, mapPropsToStyles } from "./withSpacing"
import { spacings } from "../theme/tokens"

expect.extend(matchers)

describe("withSpacing", () => {
  function MyComponent(props) {
    return <div {...props}>Hello, Bonjour, Guten Tag</div>
  }

  const Component = withSpacing()(MyComponent)

  describe("withSpacing", () => {
    it("sets defaultProps", () => {
      const defaults = { pa: 2 }

      expect(withSpacing(defaults)(MyComponent).defaultProps).toBe(defaults)
    })

    it("created component doesnt throw when mounted", () => {
      expect(() => mount(<Component />)).not.toThrow()
    })
  })

  describe("mapPropsToStyles", () => {
    const propertyShortcuts = {
      p: "padding",
      m: "margin",
    }
    const directionCombinations = {
      a: [0, 1, 2, 3],
      h: [0, 1],
      v: [2, 3],
      l: [0],
      r: [1],
      t: [2],
      b: [3],
    }
    const directions = ["Left", "Right", "Top", "Bottom"]

    Object.keys(propertyShortcuts).forEach(shortcut => {
      Object.keys(directionCombinations).forEach(combinationName => {
        const shortcutCombination = `${shortcut}${combinationName}`

        it(`handles "${shortcutCombination}" correctly`, () => {
          Object.keys(spacings).forEach(spacingName =>
            expect(
              mapPropsToStyles({
                [`${shortcutCombination}`]: spacingName,
              })
            ).toEqual(
              expect.objectContaining(
                directionCombinations[combinationName].reduce(
                  (style, direction) => ({
                    ...style,
                    [`${propertyShortcuts[shortcut]}${directions[direction]}`]: spacings[
                      spacingName
                    ],
                  }),
                  {}
                )
              )
            )
          )
        })
      })
    })
  })
})
