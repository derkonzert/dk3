import styled from "@emotion/styled"

export const Flex = styled.div(props => {
  const styles = { display: "flex" }

  if (props.alignItems) {
    styles.alignItems = props.alignItems
  }
  if (props.justifyContent) {
    styles.justifyContent = props.justifyContent
  }

  if (props.direction) {
    styles.flexDirection = props.direction
  }

  if (props.grow) {
    styles.flexGrow = props.grow
  }
  if (props.shrink) {
    styles.flexShrink = props.shrink
  }

  return styles
})
