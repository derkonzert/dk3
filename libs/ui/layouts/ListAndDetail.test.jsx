import React from "react"
import { mount } from "enzyme"

import {
  ListAndDetail,
  ListAndDetailMain,
  ListAndDetailSide,
} from "./ListAndDetail"

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

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

  /* TODO: does this actually test something? */
  it("doesnt throw when changing showDetail", async done => {
    const elem = mount(
      <ListAndDetail>
        <ListAndDetailMain>MAIN PAGE</ListAndDetailMain>
        <ListAndDetailSide>DETAIL PAGE</ListAndDetailSide>
      </ListAndDetail>
    )

    elem.setProps({
      showDetail: false,
    })

    elem.update()
    await wait(20)

    elem.setProps({
      showDetail: true,
    })

    elem.update()

    await wait(500)

    elem.setProps({
      showDetail: false,
    })

    elem.update()

    await wait(500)

    elem.setProps({
      showDetail: true,
    })

    elem.update()

    await wait(50)

    elem.unmount()

    done()
  })
})
