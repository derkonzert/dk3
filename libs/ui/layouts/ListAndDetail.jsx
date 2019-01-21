import React from "react"
import styled from "@emotion/styled"

export const ListAndDetail = ({
  children,
  className,
  showDetail,
  ...props
}) => (
  <div className={`${className}${showDetail ? " show-detail" : ""}`} {...props}>
    {children}
  </div>
)

const MainPage = styled.div`
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;

  .show-detail & {
    position: absolute;
    overflow: hidden;

    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(22, 22, 22, 0.15);
    }
  }
`

const MainPageInner = styled.div`
  padding: 2rem 1rem;
  margin: 0 auto;
  max-width: 72.8rem;
  width: 100%;

  transition: 450ms transform;

  .show-detail & {
    overflow: hidden;
    height: 100%;
    margin: -10rem 0;
    padding: 10rem 1rem;
    transform: scale(0.95) translateY(20px);
  }
`

export const ListAndDetailMain = ({ children, ...props }) => (
  <MainPage {...props}>
    <MainPageInner>{children}</MainPageInner>
  </MainPage>
)

const Side = styled.div`
  display: flex;
  z-index: 12;

  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  visibility: hidden;
  padding-top: 30rem;

  transition: 0s visibility;
  transition-delay: 450ms;

  .show-detail & {
    position: relative;
    visibility: visible;

    transition-delay: 0s;
  }
`

const SideInner = styled.div`
  width: 100%;
  background: white;
  padding: 0 1rem;

  transition: 450ms transform;
  transform: translateY(100%);
  transform: translateY(calc(100vh - 30rem));

  .show-detail & {
    transform: translateY(0);
  }
`

export const ListAndDetailSide = ({ children, ...props }) => (
  <Side {...props}>
    <SideInner>{children}</SideInner>
  </Side>
)
