import React from "react"
import styled from "@emotion/styled"
import VisuallyHidden from "@reach/visually-hidden"

import { gradientBackground } from "../common"
import { withSpacing } from "../utils/withSpacing"

export const Select = styled.div`
  position: relative;

  display: flex;
  justify-content: space-between;
  align-items: stretch;
  border-radius: 3px;
  border: 2px solid ${({ theme }) => theme.colors.inputBorderColor};
`

export const Option = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;

  flex: 1 1 0px;
  font-family: "IBM Plex Sans", sans-serif;
  font-weight: 700;

  height: 3.462rem;
  padding: 0.5rem 0 0.4rem;
  margin: -2px;

  font-size: 1.4rem;
  letter-spacing: 0;
  line-height: 1.8rem;

  transition: 250ms opacity;
  cursor: pointer;

  user-select: none;
  -webkit-user-drag: none;
`

export const CheckedOption = styled(Option)`
  position: relative;
  color: ${({ theme }) => theme.colors.checkboxColorActive};

  border-radius: 3px;

  ${gradientBackground};
`

export const UncheckedOption = styled(Option)`
  color: ${({ theme }) => theme.colors.checkboxColor};
  background: transparent;

  border-radius: 3px;

  box-shadow: inset -2px 0 0 0 ${({ theme }) => theme.colors.inputBorderColor};

  &:first-of-type {
    border-radius: 3px 0 0 3px;
  }

  &:last-of-type {
    border-radius: 0 3px 3px 0;
  }
`

export const Label = styled.label`
  font-size: 1.2rem;
  font-family: "IBM Plex Serif", serif;
  font-weight: bold;
  margin: 0 0.3rem;
`

export const SegmentedControl = withSpacing({ mv: "m" })(
  ({ children, value, name, className, onChange, label, ...props }) => (
    <div className={className}>
      {label && <Label>{label}</Label>}
      <Select {...props}>
        {React.Children.map(children, child =>
          React.cloneElement(child, {
            checked: child.props.value === value,
            onSelect: onChange,
            name: name,
          })
        )}
      </Select>
    </div>
  )
)

export const SegmentedControlOption = ({
  checked,
  name,
  value,
  children,
  onSelect,
}) => {
  const UsedOption = checked ? CheckedOption : UncheckedOption

  return (
    <UsedOption checked={checked}>
      <VisuallyHidden>
        <input
          type="radio"
          value={value}
          name={name}
          onChange={onSelect}
          checked={checked}
        />
      </VisuallyHidden>
      {children}
    </UsedOption>
  )
}
