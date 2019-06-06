import React, { useRef, useState, useEffect } from "react"
import { DateTime } from "luxon"

import { TextInput } from "./TextInput"
import { ControlledFallbackInput } from "./ControlledFallbackInput"

export const TimeInput = ({ onChange, value, ...props }) => {
  const fieldRef = useRef(null)
  const [nativeSupport, setNativeSupport] = useState(true)

  useEffect(() => {
    if (nativeSupport && fieldRef.current && fieldRef.current.type !== "time") {
      setNativeSupport(false)
    }
  }, [])

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

  return nativeSupport ? (
    <TextInput
      ref={fieldRef}
      type="time"
      value={converterDate.toFormat("HH:mm")}
      onChange={handleOnChange}
      {...props}
    />
  ) : (
    <ControlledFallbackInput
      ref={fieldRef}
      value={converterDate.toFormat("HH:mm")}
      invalidFormatMessage={"Please provide a valid time in this format: HH:mm"}
      validateValue={event => {
        const timeRegExp = /([0-9]){2}:([0-9]{2})/i
        const match = event.target.value.match(timeRegExp)

        if (match === null) {
          return false
        }

        const [hours, minutes] = match

        return parseInt(hours, 10) <= 24 && parseInt(minutes, 10) <= 60
      }}
      onChange={handleOnChange}
      {...props}
    />
  )
}
