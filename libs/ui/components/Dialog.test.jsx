import React from "react"

import { mount } from "enzyme"

import { Dialog } from "./Dialog"

describe("Dialog", () => {
  it("mounts without throwing", () => {
    expect(() => mount(<Dialog />)).not.toThrow()
  })
})
