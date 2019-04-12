import React from "react"
jest.mock("@reach/dialog/styles.css", () => undefined)

import { mount } from "enzyme"

import { Dialog } from "./Dialog"

describe("Dialog", () => {
  it("mounts without throwing", () => {
    expect(() => mount(<Dialog />)).not.toThrow()
  })
})
