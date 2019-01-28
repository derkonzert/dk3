import React from "react"
import ReactSelect from "react-select"

export const Select = props => (
  <ReactSelect
    {...props}
    theme={theme => ({
      ...theme,
      borderWidth: 3,
      colors: {
        ...theme.colors,
        primary25: "hotpink",
        primary: "black",
      },
    })}
  />
)
