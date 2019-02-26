import React from "react"
import { mount } from "enzyme"

import { Header } from "./Header"

describe("Header", () => {
  it("mounts without throwing", () => {
    expect(() => mount(<Header />)).not.toThrow()
  })
})
