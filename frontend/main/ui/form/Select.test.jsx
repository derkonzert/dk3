import React from "react"
import ReactSelect from "react-select"
import { mount } from "enzyme"

import { Select, selectThemeFn } from "./Select"

describe("Select", () => {
  it("renders ReactSelect", () => {
    expect(
      mount(<Select />)
        .find(ReactSelect)
        .exists()
    ).toBe(true)
  })

  describe("selectThemeFn", () => {
    it("enhances the theme (tbc.)", () => {
      const theme = { colors: {} }

      expect(selectThemeFn(theme)).toEqual(
        expect.objectContaining({
          borderWidth: expect.anything(),
          ...theme,
          colors: {
            ...theme.colors,
            primary: expect.anything(),
            primary25: expect.anything(),
          },
        })
      )
    })
  })
})
