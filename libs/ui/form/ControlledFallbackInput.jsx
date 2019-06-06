import React, { useState, useEffect } from "react"
import { TextInput } from "./TextInput"

export const ControlledFallbackInput = React.forwardRef(
  ({ value, onChange, validateValue, invalidFormatMessage, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(value)
    const [internalError, setInternalError] = useState(null)

    useEffect(() => {
      setInternalValue(value)
    }, [value])

    return (
      <TextInput
        ref={ref}
        value={internalValue}
        {...props}
        onChange={e => setInternalValue(e.target.value)}
        onBlur={e => {
          if (validateValue && !validateValue(e)) {
            setInternalError(invalidFormatMessage)
            return
          }
          setInternalError(null)
          onChange(e)
        }}
        error={internalError}
      />
    )
  }
)
