import React from "react"
import styled from "@emotion/styled"

import { Input, InputBorder, InputLabel, InputError } from "./TextInput"
import { State } from "react-powerplug"
import { withSpacing } from "../utils/withSpacing"

const DateInputBorder = styled(InputBorder)`
  display: grid;
  grid-auto-flow: column;
`

const InputWrapper = styled(Input)`
  border-radius: 0;
  text-align: center;
  box-shadow: -1px 0 0 0 hsl(0, 0%, 80%);

  &:first-of-type {
    border-radius: 2px 0 0 2px;
    box-shadow: none;
  }

  &:last-child {
    border-radius: 0 2px 2px 0;
  }
`

export const DateInput = withSpacing({ mb: 3 })(
  ({ label, valid, validate, error, id, value, onChange, className }) => {
    const handleChange = ({ year, month, day }) => {
      const date = new Date(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10)
      )

      onChange(date, !isNaN(date))
    }

    /* TODO: handle invalid dates or undefined values */
    const day = value.getDate()
    const month = value.getMonth() + 1
    const year = value.getFullYear()

    return (
      <div className={className}>
        {!!label && <InputLabel htmlFor={id}>{label}</InputLabel>}
        <DateInputBorder
          label={label}
          valid={valid}
          validate={validate}
          error={error}
          id={id}
          className={className}
        >
          <InputWrapper
            name="day"
            type="number"
            value={day}
            min={1}
            max={31}
            onChange={e => {
              const newState = {
                month,
                year,
                day: e.target.value,
              }
              handleChange(newState)
            }}
          />
          <InputWrapper
            name="month"
            type="number"
            min={1}
            max={12}
            value={month}
            onChange={e => {
              const newState = {
                day,
                year,
                month: e.target.value,
              }
              handleChange(newState)
            }}
          />
          <InputWrapper
            name="year"
            type="number"
            min={-3000 /* Who knows? */}
            max={3000}
            value={year}
            onChange={e => {
              const newState = {
                day,
                month,
                year: e.target.value,
              }
              handleChange(newState)
            }}
          />
        </DateInputBorder>
        {!!error && <InputError>{error}</InputError>}
      </div>
    )
  }
)
