import React from "react"
import { mount } from "enzyme"

import { Spinner } from "./Spinner"

describe("Spinner", () => {
  it("mounts without throwing", () => {
    expect(() => mount(<Spinner />)).not.toThrow()
  })
})
