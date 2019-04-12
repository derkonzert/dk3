import React from "react"
import { DateTime } from "luxon"

import { TextInput } from "./TextInput"

export const TimeInput = ({ onChange, value, ...props }) => {
  const handleOnChange = event => {
    let [hour, minute] = event.target.value.split(":")
    const parsedHour = parseInt(hour, 10)
    const parsedMinute = parseInt(minute, 10)

    const convertedDate = DateTime.local()
      .startOf("day")
      .set({
        hour: isNaN(parsedHour) ? 0 : parsedHour,
        minute: isNaN(parsedMinute) ? 0 : parsedMinute,
      })

    onChange(event, convertedDate.toJSDate())
  }

  const converterDate = DateTime.fromJSDate(value)

  return (
    <TextInput
      type="time"
      value={converterDate.toFormat("HH:mm")}
      onChange={handleOnChange}
      {...props}
    />
  )
}
