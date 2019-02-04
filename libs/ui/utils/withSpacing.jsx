import styled from "@emotion/styled"

/* Spacing levels in rem */
export const spacings = [0, 0.25, 0.5, 1, 2, 4, 8, 16, "auto"].map(val => {
  if (typeof val === "number") {
    return `${val}rem`
  }
  return val
})

export const mapPropsToStyles = props => {
  let styles = {}

  if (props.pa !== undefined) {
    styles.paddingLeft = spacings[props.pa]
    styles.paddingRight = spacings[props.pa]
    styles.paddingTop = spacings[props.pa]
    styles.paddingBottom = spacings[props.pa]
  }

  if (props.ph !== undefined) {
    styles.paddingLeft = spacings[props.ph]
    styles.paddingRight = spacings[props.ph]
  }

  if (props.pv !== undefined) {
    styles.paddingTop = spacings[props.pv]
    styles.paddingBottom = spacings[props.pv]
  }

  if (props.pl !== undefined) {
    styles.paddingLeft = spacings[props.pl]
  }
  if (props.pr !== undefined) {
    styles.paddingRight = spacings[props.pr]
  }
  if (props.pt !== undefined) {
    styles.paddingTop = spacings[props.pt]
  }
  if (props.pb !== undefined) {
    styles.paddingBottom = spacings[props.pb]
  }

  if (props.ma !== undefined) {
    styles.marginLeft = spacings[props.ma]
    styles.marginRight = spacings[props.ma]
    styles.marginTop = spacings[props.ma]
    styles.marginBottom = spacings[props.ma]
  }
  if (props.mh !== undefined) {
    styles.marginLeft = spacings[props.mh]
    styles.marginRight = spacings[props.mh]
  }
  if (props.mv !== undefined) {
    styles.marginTop = spacings[props.mv]
    styles.marginBottom = spacings[props.mv]
  }
  if (props.ml !== undefined) {
    styles.marginLeft = spacings[props.ml]
  }
  if (props.mr !== undefined) {
    styles.marginRight = spacings[props.mr]
  }
  if (props.mt !== undefined) {
    styles.marginTop = spacings[props.mt]
  }
  if (props.mb !== undefined) {
    styles.marginBottom = spacings[props.mb]
  }

  return styles
}

export const withSpacing = defaultProps => Component => {
  /* TODO: remove spacing props, so they don't get rendered in Component */
  const ComposedComponent = styled(Component)(mapPropsToStyles)

  ComposedComponent.defaultProps = defaultProps

  return ComposedComponent
}
