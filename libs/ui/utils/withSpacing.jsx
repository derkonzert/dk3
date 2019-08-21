import React from "react"
import styled from "@emotion/styled"

import { spacings } from "../theme/tokens"

/* Spacing levels in rem */
export const legacySpacingsMap = {
  0: "none",
  1: "xs",
  2: "s",
  3: "m",
  4: "l",
  5: "xl",
  6: "xxl",
  7: "xxxl",
  8: "auto",
}

const getSpacing = (spacing, key) => {
  if (legacySpacingsMap[spacing]) {
    console.error(
      `Convert use of spacing "${key}={${spacing}}" into "${legacySpacingsMap[spacing]}"!`
    )
    return spacings[legacySpacingsMap[spacing]]
  }
  return spacings[spacing]
}

export const cleanProps = props => {
  /* TODO: there might be a smarter way to do this? */
  /* eslint-disable no-unused-vars */
  const {
    ma,
    ml,
    mr,
    mt,
    mb,
    mh,
    mv,
    pa,
    pl,
    pr,
    pt,
    pb,
    ph,
    pv,
    ...rest
  } = props
  /* eslint-enable: no-unused-vars */

  return rest
}

export const mapPropsToStyles = props => {
  let styles = {}

  if (props.pa !== undefined) {
    styles.paddingLeft = getSpacing(props.pa, "pa")
    styles.paddingRight = getSpacing(props.pa, "pa")
    styles.paddingTop = getSpacing(props.pa, "pa")
    styles.paddingBottom = getSpacing(props.pa, "pa")
  }

  if (props.ph !== undefined) {
    styles.paddingLeft = getSpacing(props.ph, "ph")
    styles.paddingRight = getSpacing(props.ph, "ph")
  }

  if (props.pv !== undefined) {
    styles.paddingTop = getSpacing(props.pv, "pv")
    styles.paddingBottom = getSpacing(props.pv, "pv")
  }

  if (props.pl !== undefined) {
    styles.paddingLeft = getSpacing(props.pl, "pl")
  }
  if (props.pr !== undefined) {
    styles.paddingRight = getSpacing(props.pr, "pr")
  }
  if (props.pt !== undefined) {
    styles.paddingTop = getSpacing(props.pt, "pt")
  }
  if (props.pb !== undefined) {
    styles.paddingBottom = getSpacing(props.pb, "pb")
  }

  if (props.ma !== undefined) {
    styles.marginLeft = getSpacing(props.ma, "ma")
    styles.marginRight = getSpacing(props.ma, "ma")
    styles.marginTop = getSpacing(props.ma, "ma")
    styles.marginBottom = getSpacing(props.ma, "ma")
  }
  if (props.mh !== undefined) {
    styles.marginLeft = getSpacing(props.mh, "mh")
    styles.marginRight = getSpacing(props.mh, "mh")
  }
  if (props.mv !== undefined) {
    styles.marginTop = getSpacing(props.mv, "mv")
    styles.marginBottom = getSpacing(props.mv, "mv")
  }
  if (props.ml !== undefined) {
    styles.marginLeft = getSpacing(props.ml, "ml")
  }
  if (props.mr !== undefined) {
    styles.marginRight = getSpacing(props.mr, "mr")
  }
  if (props.mt !== undefined) {
    styles.marginTop = getSpacing(props.mt, "mt")
  }
  if (props.mb !== undefined) {
    styles.marginBottom = getSpacing(props.mb, "mb")
  }

  return styles
}

export const withSpacing = defaultProps => Component => {
  /* TODO: remove spacing props, so they don't get rendered in Component */
  const ComposedComponent = styled(
    React.forwardRef((props, ref) => (
      <Component ref={ref} {...cleanProps(props)} />
    ))
  )(mapPropsToStyles)

  ComposedComponent.defaultProps = defaultProps

  return ComposedComponent
}
