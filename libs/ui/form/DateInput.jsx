import React from "react"
import { DateTime } from "luxon"
import { TextInput } from "./TextInput"

export const DateInput = ({ onChange, value, ...props }) => {
  const handleOnChange = event => {
    const dateObject = new Date(event.target.value)

    onChange(event, isNaN(dateObject.getDay()) ? null : dateObject)
  }

  let textValue = value
  if (value instanceof Date) {
    const lD = DateTime.fromJSDate(value)
    textValue = lD.toFormat("yyyy-MM-dd")
  }

  return (
    <TextInput
      type="date"
      value={textValue}
      onChange={handleOnChange}
      {...props}
    />
  )
}
