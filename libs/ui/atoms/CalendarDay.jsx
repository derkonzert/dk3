import React from "react"
import styled from "@emotion/styled"
import { spacings } from "../theme/tokens"

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: ${spacings.xl};
  padding: 0 ${spacings.s};

  box-sizing: content-box;
  flex: 0 0 auto;
  text-align: center;
`
export const Day = styled.div`
  font-family: "IBM Plex Sans Condensed", sans-serif;
  font-weight: bold;
  font-size: 1.6rem;
  color: ${({ inverted, theme }) =>
    inverted ? theme.colors.titleInverted : theme.colors.title};
  letter-spacing: 0;
  line-height: 1.4;
  text-align: center;
`
export const DayName = styled.div`
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 1.2rem;
  color: ${({ inverted, theme }) =>
    inverted ? theme.colors.descriptionInverted : theme.colors.description};
  letter-spacing: 0;
  line-height: 1.3;
  text-align: center;
`

export const twoCharNumber = num => (num <= 9 ? `0${num}` : num)

export const CalendarDay = ({ day, dayName, inverted, ...props }) => (
  <Wrapper {...props}>
    <Day inverted={inverted}>{twoCharNumber(day)}</Day>
    <DayName inverted={inverted}>{dayName}</DayName>
  </Wrapper>
)
