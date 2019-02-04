import React from "react"
import { matchers } from "jest-emotion"
import { mount } from "enzyme"

import {
  SegmentedControl,
  SegmentedControlOption,
  Option,
} from "./SegmentedControl"

expect.extend(matchers)

describe("SegmentedControl", () => {
  it("mounts without throwing", () => {
    expect(() =>
      mount(
        <SegmentedControl onChange={() => {}} name="you" value="1">
          <SegmentedControlOption value="1" />
          <SegmentedControlOption value="2" />
        </SegmentedControl>
      )
    ).not.toThrow()
  })

  it("passes name and checked state to options", () => {
    const elem = mount(
      <SegmentedControl onChange={() => {}} name="you" value="1">
        <SegmentedControlOption value="1" />
        <SegmentedControlOption value="2" />
      </SegmentedControl>
    )

    const options = elem.find(SegmentedControlOption)
    expect(options.length).toBe(2)

    const option1 = options.get(0)
    const option2 = options.get(1)

    expect(option1.props.name).toBe("you")
    expect(option2.props.name).toBe("you")
    expect(option1.props.checked).toBe(true)
    expect(option2.props.checked).toBe(false)
  })

  it("handles onChange", () => {
    const onChange = jest.fn()
    const fakeEvent = { abc: "def" }
    const elem = mount(
      <SegmentedControl onChange={onChange} name="you" value="1">
        <SegmentedControlOption value="1" />
        <SegmentedControlOption value="2" />
      </SegmentedControl>
    )

    elem
      .find(SegmentedControlOption)
      .at(1)
      .find("input")
      .simulate("change", fakeEvent)

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        ...fakeEvent,
      })
    )
  })

  describe("SegmentedControlOption", () => {
    it("adds unfavored style", () => {
      expect(
        mount(<SegmentedControlOption unfavored />)
          .find(Option)
          .prop("unfavored")
      ).toBe(true)
    })
  })
})
