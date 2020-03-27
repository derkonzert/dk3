/** @jsx jsx */
import { jsx, css } from "@emotion/core"
import { withTheme } from "emotion-theming"
import styled from "@emotion/styled"

import { rgba } from "../theme/rgba"
import { Bookmark as BookmarkIcon } from "../icons/Bookmark"
import { BaseBox } from "../atoms/Boxes"
import { SubTitle, Description } from "../atoms/Typography"
import { CalendarDay } from "../atoms/CalendarDay"
import { spacings } from "../theme/tokens"

const EventCardContent = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  flex: 1 1 auto;

  cursor: pointer;
  -webkit-user-drag: none;
  user-select: none;

  ${({ theme, isFilled }) =>
    isFilled &&
    css`
      background: ${theme.colors.boxBackground};
    `}
`

const linkStyle = css`
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
  justify-content: flex-start;
  text-decoration: none;
`

const TextContent = styled.div(
  ({ size }) => css`
    flex-grow: 1;
    padding: ${spacings.m};

    ${size === "l" &&
      css`
        flex-grow: 1;
        padding: ${spacings.l} ${spacings.m};
      `}
    ${size === "xl" &&
      css`
        flex-grow: 1;
        padding: ${spacings.xl} ${spacings.m};
      `}
  `
)

const calendar = css`
  border-right: 1px solid rgba(0, 0, 0, 0.075);
`

const BookmarkButton = styled.button`
  display: block;
  appearance: none;

  flex: 0 0 auto;
  width: 4.2rem;

  font-size: 1.6rem;
  border: none;
  background: transparent;

  color: currentColor;
  opacity: 0.25;

  cursor: pointer;

  &:focus {
    outline: none;
    background: rgba(0, 0, 0, 0.1);
  }

  &:hover {
    opacity: 0.8;
  }

  svg {
    display: inline-block;
    vertical-align: middle;
    width: 1.4rem;
  }

  ${({ active }) =>
    active &&
    css`
      opacity: 1;
    `}
`

export const EventBox = styled(BaseBox)`
  transition: 150ms box-shadow;

  &:hover {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
  }

  ${({ approved, theme }) =>
    !approved &&
    css`
      background-color: ${rgba(theme.colors.boxBackground, 0.5)};
    `}
`

export const EventCard = withTheme(
  ({
    theme,
    id,
    title,
    description,
    fancyLevel,
    day,
    dayName,
    large,
    renderBadge,
    approved = true,
    bookmarked = false,
    bookmarkable = true,
    postponed = false,
    canceled = false,
    linkProps = {},
    onBookmarkClick,
    ...props
  }) => {
    const superFancy = approved ? fancyLevel === 2 : false
    const regularFancy = approved ? fancyLevel === 1 : false
    const textContentSize = large ? (superFancy ? "xl" : "l") : "m"

    const inverted = superFancy ? theme.name !== "dark" : false

    return (
      <EventBox
        approved={approved}
        fancyLevel={approved ? fancyLevel : 0}
        {...props}
      >
        <EventCardContent isFilled={regularFancy}>
          <a css={linkStyle} {...linkProps}>
            <CalendarDay
              css={calendar}
              day={day}
              dayName={dayName}
              inverted={inverted}
            />
            <TextContent size={textContentSize}>
              <SubTitle
                mb="xs"
                inverted={inverted}
                lineThrough={postponed || canceled}
              >
                {title}
              </SubTitle>
              <Description inverted={inverted}>
                {!!renderBadge &&
                  renderBadge({
                    inverted:
                      fancyLevel === 2 && approved
                        ? true
                        : theme.name === "dark",
                  })}
                {description}
              </Description>
            </TextContent>
          </a>
          {bookmarkable && (
            <BookmarkButton
              active={bookmarked}
              aria-label={
                bookmarked
                  ? `Remove "${title}" from your bookmarks`
                  : `Add "${title}" to your bookmarks`
              }
              onClick={onBookmarkClick}
            >
              <BookmarkIcon id={id} bookmarked={bookmarked} />
            </BookmarkButton>
          )}
        </EventCardContent>
      </EventBox>
    )
  }
)
