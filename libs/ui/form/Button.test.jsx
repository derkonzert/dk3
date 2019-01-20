import React from "react"
import { matchers } from "jest-emotion"
import { mount } from "enzyme"

import { Button } from "./Button"

expect.extend(matchers)

describe("Button", () => {
  it("mounts without throwing", () => {
    expect(() => mount(<Button />)).not.toThrow()
  })
})
