import styled from "@emotion/styled"

export const HorizontalMenu = styled.nav`
  display: flex;
  justify-content: flex-end;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
  max-width: 68.8rem;
`

export const HorizontalMenuItem = styled.a`
  display: inline-block;

  padding: 1rem;
  font-size: 1.2rem;
  font-family: "IBM Plex Serif", serif;
  color: ${({ theme }) => theme.colors.horizontalMenuColor};

  text-decoration: none;
`
