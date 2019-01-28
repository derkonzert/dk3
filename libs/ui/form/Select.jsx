import React from "react"
import ReactSelect from "react-select"

export const selectThemeFn = theme => ({
  ...theme,
  borderWidth: 3,
  colors: {
    ...theme.colors,
    primary25: "hotpink",
    primary: "black",
  },
})

export const Select = props => <ReactSelect {...props} theme={selectThemeFn} />
