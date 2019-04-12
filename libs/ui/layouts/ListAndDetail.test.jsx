import React from "react"

import {
  ListAndDetail,
  ListAndDetailMain,
  ListAndDetailSide,
} from "./ListAndDetail"
import { mountWithTheme } from "../utils/testHelpers"

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

describe("ListAndDetail", () => {
  it("mounts without throwing", () => {
    expect(() =>
      mountWithTheme(
        <ListAndDetail showDetail>
          <ListAndDetailMain>MAIN PAGE</ListAndDetailMain>
          <ListAndDetailSide>DETAIL PAGE</ListAndDetailSide>
        </ListAndDetail>
      )
    ).not.toThrow()
  })

  /* TODO: does this actually test something? */
  it("doesnt throw when changing showDetail", async done => {
    const elem = mountWithTheme(
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
