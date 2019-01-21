import styled from "@emotion/styled"
import { withSpacing } from "../utils/withSpacing"

export const Button = withSpacing()(styled.button`
  appearance: none;
  border: 0 none;
  padding: 0.5rem 0.8rem;

  border-radius: 0.2rem;
  box-shadow: inset 0 0 0 0.1rem rgba(0, 0, 0, 0.15);

  font-family: IBMPlexSans-SemiBold;
  font-size: 1.2rem;
  font-weight: normal;
  line-height: 1.6rem;

  cursor: pointer;

  &:hover {
    box-shadow: inset 0 0 0 0.1rem rgba(0, 0, 0, 0.35);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.05);
  }
`)
