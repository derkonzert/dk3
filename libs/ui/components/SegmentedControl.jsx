import React from "react"
import { css } from "@emotion/core"
import styled from "@emotion/styled"
import VisuallyHidden from "@reach/visually-hidden"

import { gradientBackground } from "../common"
import { withSpacing } from "../utils/withSpacing"

export const Select = styled.div`
  position: relative;

  display: flex;
  justify-content: space-between;
  align-items: stretch;
  border-radius: 0.3rem;
  border: 0.2rem solid #d9d9d9;
`

export const Option = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;

  flex: 1 1 0px;
  font-family: IBMPlexSans-SemiBold;
  font-weight: inherit;

  padding: 0.5rem 0 0.4rem;
  margin: -0.2rem;

  font-size: 1.4rem;
  font-weight: normal;
  letter-spacing: 0;
  line-height: 1.8rem;

  transition: 250ms opacity;
  cursor: pointer;

  user-select: none;
  -webkit-user-drag: none;

  ${({ checked }) => (checked ? optionCheckedStyle : optionUnCheckedStyle)};
  ${({ unfavored, checked }) => (unfavored && checked ? unfavoredStyle : "")};
`

export const Label = styled.label`
  font-size: 1.2rem;
  font-family: IBMPlexSerif-Bold;
  margin: 0 0.3rem;
`

export const optionUnCheckedStyle = css`
  color: #ababab;
  background: transparent;

  box-shadow: inset -0.2rem 0 0 0 #d9d9d9;
`

export const optionCheckedStyle = css`
  position: relative;
  z-index: 1;
  color: white;

  border-radius: 0.3rem;

  ${gradientBackground};
`

export const unfavoredStyle = css`
  filter: saturate(0);
`

export const SegmentedControl = withSpacing({ mv: 3 })(
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
  unfavored,
}) => (
  <Option checked={checked} unfavored={unfavored}>
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
  </Option>
)
