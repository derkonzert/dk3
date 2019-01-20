import React from "react"
import { Global } from "@emotion/core"
import { mount } from "enzyme"

import { global } from "../documentStyles"
import DoczWrapper from "./doczWrapper"

describe("doczWrapper", () => {
  it("renders its global styles", () => {
    expect(
      mount(<DoczWrapper />)
        .find(Global)
        .prop("styles")
    ).toEqual(global)
  })
})
