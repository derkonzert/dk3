import React from "react"
import styled from "@emotion/styled"

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 4.2rem;

  flex: 0 0 auto;
  text-align: center;
`
export const Day = styled.div`
  font-family: IBMPlexSansCond-Bold;
  font-size: 1.8rem;
  color: ${({ inverted }) => (inverted ? "white" : "black")};
  letter-spacing: 0;
  line-height: 1.2;
  text-align: center;
`
export const DayName = styled.div`
  font-family: IBMPlexSans-Text;
  font-size: 1rem;
  color: ${({ inverted }) => (inverted ? "white" : "#3f3f3f")};
  letter-spacing: 0;
  line-height: 1.2;
  text-align: center;
`

export const twoCharNumber = num => (num <= 9 ? `0${num}` : num)

export const CalendarDay = ({ day, dayName, inverted, ...props }) => (
  <Wrapper {...props}>
    <Day inverted={inverted}>{twoCharNumber(day)}</Day>
    <DayName inverted={inverted}>{dayName}</DayName>
  </Wrapper>
)
