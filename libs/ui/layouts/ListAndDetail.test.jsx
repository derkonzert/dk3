import React from "react"
import { mount } from "enzyme"

import {
  ListAndDetail,
  ListAndDetailMain,
  ListAndDetailSide,
} from "./ListAndDetail"

describe("ListAndDetail", () => {
  it("mounts without throwing", () => {
    expect(() =>
      mount(
        <ListAndDetail showDetail>
          <ListAndDetailMain>MAIN PAGE</ListAndDetailMain>
          <ListAndDetailSide>DETAIL PAGE</ListAndDetailSide>
        </ListAndDetail>
      )
    ).not.toThrow()
  })
})
