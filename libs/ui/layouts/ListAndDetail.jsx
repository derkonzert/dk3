import React from "react"
import { css } from "@emotion/core"
import styled from "@emotion/styled"

export const ListAndDetail = ({ showDetail, children }) => (
  <React.Fragment>
    {React.Children.map(children, child =>
      React.cloneElement(child, {
        showDetail,
      })
    )}
  </React.Fragment>
)

const mainPageShowDetail = css`
  will-change: background-color;
  bottom: 0;
  background: rgba(22, 22, 22, 0.65);
`
const MainPage = styled.div`
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;

  perspective: 110rem;
  perspective-origin: 50% 100%;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;

    background: rgba(22, 22, 22, 0);
    transition: 350ms background-color;

    ${props => (props.showDetail ? mainPageShowDetail : "")}
  }

  .cacheFixedPosition & {
    position: fixed;
    overflow: hidden;
  }
`

const mainPageInnerShowDetail = css`
  will-change: transform;
  transform: translate3d(0, 4rem, -6rem);
`
const MainPageInner = styled.div`
  box-sizing: content-box;
  padding: 2rem 1rem;
  margin: 0 auto;
  max-width: 72.8rem;

  transition: 350ms transform ease-out;

  ${props => (props.showDetail ? mainPageInnerShowDetail : "")}

  .cacheFixedPosition & {
    overflow: hidden;
    height: 100%;
    margin: -10rem auto;
    padding: 12rem 1rem;
  }
`

const documentElement = () => window.document.documentElement
const scrollTo = (element, x, y) => element.scrollTo && element.scrollTo(x, y)

export class ListAndDetailMain extends React.Component {
  constructor(props) {
    super(props)

    this.innerRef = React.createRef()
  }

  getSnapshotBeforeUpdate(prevProps /*, prevState*/) {
    // Did showDetail change to true?
    if (!prevProps.showDetail && this.props.showDetail) {
      // Return the current window scroll position
      return window.pageYOffset
    } else if (prevProps.showDetail && !this.props.showDetail) {
      // Return the wrappers scroll-position
      return this.innerRef.current.scrollTop
    }

    return null
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.scheduleUpdate) {
      clearTimeout(this.scheduleUpdate)
    }

    if (snapshot !== null) {
      if (this.props.showDetail) {
        documentElement().classList.add("cacheFixedPosition")

        scrollTo(this.innerRef.current, 0, snapshot)
        scrollTo(window, 0, 0)
      } else {
        this.scheduleUpdate = setTimeout(() => {
          documentElement().classList.remove("cacheFixedPosition")

          scrollTo(this.innerRef.current, 0, 0)
          scrollTo(window, 0, snapshot)
        }, 500)
      }
    }
  }

  componentWillUnmount() {
    if (this.scheduleUpdate) {
      clearTimeout(this.scheduleUpdate)
    }

    documentElement().classList.remove("cacheFixedPosition")
  }

  render() {
    const { children, showDetail, ...props } = this.props

    return (
      <MainPage showDetail={showDetail} {...props}>
        <MainPageInner showDetail={showDetail} ref={this.innerRef}>
          {children}
        </MainPageInner>
      </MainPage>
    )
  }
}

const sideShowDetail = css`
  position: relative;
  visibility: visible;

  transition-delay: 0s;
`

const Side = styled.div`
  display: flex;
  z-index: 12;

  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  min-height: 100.5vh;

  visibility: hidden;
  padding-top: 30rem;

  transition: 0s visibility;
  transition-delay: 350ms;

  ${props => (props.showDetail ? sideShowDetail : "")}
`

const sideInnerShowDetail = css`
  transform: translateY(0);
`
const SideInner = styled.div`
  width: 100%;
  background: white;
  border-radius: 1.2rem 1.2rem 0 0;

  transition: 350ms transform;
  transform: translateY(100%);
  transform: translateY(calc(100.5vh - 30rem));

  ${props => (props.showDetail ? sideInnerShowDetail : "")}
`

const SideInnerContent = styled.div`
  margin: 0 auto;
  max-width: 72.8rem;
  padding: 1rem 1.5rem;
`

class CacheContentFor extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static getDerivedStateFromProps(props, state) {
    if (!!props.children && props.children !== state.children) {
      // Children were removed: Cache them for x ms
      return {
        children: props.children,
      }
    }

    return null
  }

  componentWillUnmount() {
    if (this.scheduledRemoval) {
      clearTimeout(this.scheduledRemoval)
    }
  }

  componentDidUpdate() {
    if (this.state.children && !this.scheduledRemoval) {
      this.scheduledRemoval = setTimeout(() => {
        this.setState({ children: null })
      }, this.props.ms)
    }
  }

  render() {
    const { children } = this.props
    return <React.Fragment>{children || this.state.children}</React.Fragment>
  }
}

export const ListAndDetailSide = ({ children, showDetail, ...props }) => (
  <Side showDetail={showDetail} {...props}>
    <SideInner showDetail={showDetail}>
      <SideInnerContent>
        <CacheContentFor ms={500}>{children}</CacheContentFor>
      </SideInnerContent>
    </SideInner>
  </Side>
)
