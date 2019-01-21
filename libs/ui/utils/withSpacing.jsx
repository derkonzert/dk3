import styled from "@emotion/styled"

/* Spacing levels in rem */
export const spacings = [0, 0.25, 0.5, 1, 2, 4, 8, 16]

export const SpacingMachine = styled.div(props => {
  let styles = {}

  if (props.pa !== undefined) {
    styles.paddingLeft = `${spacings[props.pa]}rem`
    styles.paddingRight = `${spacings[props.pa]}rem`
    styles.paddingTop = `${spacings[props.pa]}rem`
    styles.paddingBottom = `${spacings[props.pa]}rem`
  }

  if (props.ph) {
    styles.paddingLeft = `${spacings[props.ph]}rem`
    styles.paddingRight = `${spacings[props.ph]}rem`
  }

  if (props.pv) {
    styles.paddingTop = `${spacings[props.pv]}rem`
    styles.paddingBottom = `${spacings[props.pv]}rem`
  }

  if (props.pl !== undefined) {
    styles.paddingLeft = `${spacings[props.pl]}rem`
  }
  if (props.pr !== undefined) {
    styles.paddingRight = `${spacings[props.pr]}rem`
  }
  if (props.pt !== undefined) {
    styles.paddingTop = `${spacings[props.pt]}rem`
  }
  if (props.pb !== undefined) {
    styles.paddingBottom = `${spacings[props.pb]}rem`
  }

  if (props.ma !== undefined) {
    styles.margin = `${spacings[props.ma]}rem`
  }
  if (props.mh !== undefined) {
    styles.marginLeft = `${spacings[props.mh]}rem`
    styles.marginRight = `${spacings[props.mh]}rem`
  }
  if (props.mv !== undefined) {
    styles.marginTop = `${spacings[props.mv]}rem`
    styles.marginBottom = `${spacings[props.mv]}rem`
  }
  if (props.ml !== undefined) {
    styles.marginLeft = `${spacings[props.ml]}rem`
  }
  if (props.mr !== undefined) {
    styles.marginRight = `${spacings[props.mr]}rem`
  }
  if (props.mt !== undefined) {
    styles.marginTop = `${spacings[props.mt]}rem`
  }
  if (props.mb !== undefined) {
    styles.marginBottom = `${spacings[props.mb]}rem`
  }

  return styles
})

export const withSpacing = defaultProps => Component => {
  /* TODO: remove spacing props, so they don't get rendered in Component */
  const ComposedComponent = SpacingMachine.withComponent(Component)

  ComposedComponent.defaultProps = defaultProps

  return ComposedComponent
}
