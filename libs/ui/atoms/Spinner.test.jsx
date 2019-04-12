import React from "react"

import { Spinner } from "./Spinner"
import { mountWithTheme } from "../utils/testHelpers"

describe("Spinner", () => {
  it("mounts without throwing", () => {
    expect(() => mountWithTheme(<Spinner />)).not.toThrow()
  })
})
