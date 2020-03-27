import React from "react"

import { DateInput } from "./DateInput"
import { TimeInput } from "./TimeInput"
import styled from "@emotion/styled"
import { withSpacing } from "../utils/withSpacing"

export const DateTimeWrapper = styled.div`
  display: grid;
  align-items: flex-start;
  grid-gap: 0 1rem;
  grid-template-columns: 3fr 1fr;
`

export const DateTimeTimeField = styled(TimeInput)`
  label {
    white-space: nowrap;
  }
`

export const setTimeOnDate = (date, time) => {
  date.setMilliseconds(0)
  date.setSeconds(0)
  date.setMinutes(time.getMinutes())
  date.setHours(time.getHours())

  return date
}

export const DateTimeInput = withSpacing()(
  ({
    name,
    onChange,
    dateLabel,
    timeLabel,
    dateError,
    timeError,
    value,
    ...props
  }) => {
    const handleTimeChange = (event, timeValue) => {
      onChange(event, setTimeOnDate(value, timeValue))
    }

    const handleDateChange = (event, dateValue) => {
      const dateCopy = new Date(value)

      if (dateValue) {
        dateCopy.setFullYear(dateValue.getFullYear())
        dateCopy.setDate(dateValue.getDate())
        dateCopy.setMonth(dateValue.getMonth())
      }

      onChange(event, dateCopy)
    }

    return (
      <DateTimeWrapper>
        <DateInput
          name={`${name}_date`}
          value={value}
          onChange={handleDateChange}
          label={dateLabel}
          error={dateError}
          {...props}
        />
        <DateTimeTimeField
          name={`${name}_time`}
          value={value}
          onChange={handleTimeChange}
          label={timeLabel}
          error={timeError}
          {...props}
        />
      </DateTimeWrapper>
    )
  }
)
