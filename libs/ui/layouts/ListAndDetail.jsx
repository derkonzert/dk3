import React from "react"
import { css } from "@emotion/core"
import styled from "@emotion/styled"
import useClickOutside from "click-outside-hook"
import FocusLock from "react-focus-lock"

export const ListAndDetail = ({ showDetail, children }) => (
  <React.Fragment>
    {React.Children.map(children, child =>
      React.cloneElement(child, {
        showDetail,
      })
    )}
  </React.Fragment>
)

const mainPageShowDetail = ({ theme }) => css`
  will-change: background-color;
  z-index: 0;
  pointer-events: initial;
  background: ${theme.colors.overlayActive};
  transition-delay: 0s, 0s;
`
const MainPage = styled.div`
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    z-index: -1;
    pointer-events: none;

    background: ${({ theme }) => theme.colors.overlay};
    transition: 350ms background-color, 0s z-index 350ms;

    ${props => (props.showDetail ? mainPageShowDetail(props) : "")}
  }

  .cacheFixedPosition & {
    position: fixed;
    overflow: hidden;
  }
`

const mainPageInnerShowDetail = css`
  will-change: transform;
  transform: translateY(4rem) scale(0.96);
  filter: blur(4px);
`
const MainPageInner = styled.div`
  box-sizing: content-box;
  padding: 0;

  transition: 350ms transform ease-out;

  ${props => (props.showDetail ? mainPageInnerShowDetail : "")}

  .cacheFixedPosition & {
    overflow: hidden;
    height: 100%;
    margin: -10rem auto;
    padding: 10rem 0;
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

  componentDidMount() {
    if (this.props.showDetail) {
      documentElement().classList.add("cacheFixedPosition")
    }
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
  padding-top: 38.2vh;

  transition: 0s visibility;
  transition-delay: 350ms;

  ${props => (props.showDetail ? sideShowDetail : "")}
`

const sideInnerShowDetail = css`
  transform: translateY(0);
`
const SideInner = styled.div`
  padding: 2rem;
  width: 100%;
  background: ${({ theme }) => theme.colors.detailBackground};

  transition: 350ms transform;
  transform: translateY(100%);
  transform: translateY(calc(100.5vh - 38.2vh));

  will-change: transform;

  ${props => (props.showDetail ? sideInnerShowDetail : "")}
`

export const CenteredContent = styled.div`
  margin: 0 auto;
  max-width: 68.8rem;
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

export const ListAndDetailSide = ({
  children,
  showDetail,
  requestClose,
  ...props
}) => {
  const ref = useClickOutside(
    e => requestClose && showDetail && requestClose(e)
  )

  return (
    <Side data-side={showDetail} showDetail={showDetail} {...props}>
      <SideInner ref={ref} showDetail={showDetail}>
        <CenteredContent>
          <FocusLock returnFocus>
            <CacheContentFor ms={500}>{children}</CacheContentFor>
          </FocusLock>
        </CenteredContent>
      </SideInner>
    </Side>
  )
}
const ListAndDetailCloseWrapper = styled.a`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 5rem;
  line-height: 1.2;
  width: 4rem;
  text-align: center;
  text-decoration: none;
  font-family: "IBM Plex Serif";
  color: ${({ theme }) => theme.colors.text};
`

export const ListAndDetailClose = React.forwardRef((props, ref) => (
  <ListAndDetailCloseWrapper ref={ref} {...props}>
    &times;
  </ListAndDetailCloseWrapper>
))
