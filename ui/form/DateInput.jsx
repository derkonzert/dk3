import React, { useRef, useState, useEffect } from "react"
import { DateTime } from "luxon"
import { TextInput } from "./TextInput"
import { ControlledFallbackInput } from "./ControlledFallbackInput"

export const DateInput = ({ onChange, value, ...props }) => {
  const fieldRef = useRef(null)
  const [nativeSupport, setNativeSupport] = useState(true)
  let textFormat = nativeSupport ? "yyyy-MM-dd" : "dd.MM.yyyy"

  useEffect(() => {
    if (nativeSupport && fieldRef.current && fieldRef.current.type !== "date") {
      setNativeSupport(false)
    }
  }, [])

  const handleOnChange = event => {
    const dateTime = DateTime.fromFormat(event.target.value, textFormat)
    const dateObject = dateTime.toJSDate()

    onChange(event, isNaN(dateObject.getDay()) ? null : dateObject)
  }

  let textValue = value
  if (value instanceof Date) {
    const lD = DateTime.fromJSDate(value)
    textValue = lD.toFormat(textFormat)
  }

  return nativeSupport ? (
    <TextInput
      ref={fieldRef}
      type="date"
      value={textValue}
      onChange={handleOnChange}
      {...props}
    />
  ) : (
    <ControlledFallbackInput
      ref={fieldRef}
      value={textValue}
      description={textFormat}
      invalidFormatMessage={
        "Please provide a valid date in this format: dd.MM.yyyy"
      }
      validateValue={event => {
        return DateTime.fromFormat(event.target.value, textFormat).isValid
      }}
      onChange={handleOnChange}
      {...props}
    />
  )
}
