import React from "react"
import { mount } from "enzyme"

import { Spacer } from "./Spacer"

describe("Spacer", () => {
  it("mounts without throwing", () => {
    expect(() => mount(<Spacer />)).not.toThrow()
  })
})
