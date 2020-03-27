import React from "react"
import { useSpring, useTransition, animated } from "react-spring"
import styled from "@emotion/styled"

import { useMeasure } from "../lib/useMeasure"

const Wrapper = styled(animated.div)`
  position: relative;
`

const Page = styled(animated.div)`
  padding: 1px;
  background-color: ${({ theme }) => theme.colors.boxBackground};
`

const transformFrom = "translate3d(100%, 0, 0)"
const transformTo = "translate3d(-50%, 0, 0)"

export const StepsView = ({ children, backwards = false, ...props }) => {
  const [bind, { height }] = useMeasure()
  const heightProps = useSpring({
    height: height === 0 ? "auto" : height,
  })
  const visibleChild = React.Children.toArray(children).filter(Boolean)[0]

  const transitions = useTransition(visibleChild, child => child.key, {
    from: { opacity: 1, transform: backwards ? transformTo : transformFrom },
    enter: { opacity: 1, transform: "translate3d(0%, 0, 0)" },
    leave: {
      position: "absolute",
      opacity: 0,
      transform: backwards ? transformFrom : transformTo,
    },
    initial: { opacity: 1, transform: "translate3d(0%, 0, 0)" },
  })

  return (
    <Wrapper
      {...props}
      style={{ height: height === 0 ? "auto" : heightProps.height }}
    >
      <div {...bind}>
        {transitions.map(({ props, item, key }) => {
          return (
            <Page style={props} key={key}>
              {item}
            </Page>
          )
        })}
      </div>
    </Wrapper>
  )
}
