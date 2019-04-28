/** @jsx jsx */
import { jsx, css } from "@emotion/core"
import { withTheme } from "emotion-theming"

import { Bookmark } from "../icons/Bookmark"
import { BaseBox } from "../atoms/Boxes"
import { SubTitle, Description } from "../atoms/Typography"
import { CalendarDay } from "../atoms/CalendarDay"

const cardContent = css`
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

const textContentStyle = css`
  flex-grow: 1;
  padding: 0.7rem 0 0.5rem;
`

const textContentStyleLarge = css`
  flex-grow: 1;
  padding: 1.7rem 1.6rem 1.5rem;
`

const textContentStyleLargeFancy = css`
  flex-grow: 1;
  padding: 4.5rem 1.6rem 4.5rem;
`

const calendar = css`
  margin-right: 0.9rem;
  border-right: 1px solid rgba(0, 0, 0, 0.075);
`

const bookmark = css`
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
`

export const boxHoverStyle = css`
  & {
    transition: 150ms box-shadow;
  }

  &:hover {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
  }
`

export const bookmarkActive = css`
  opacity: 1;
`

export const EventCard = withTheme(
  ({
    theme,
    title,
    description,
    fancyLevel,
    day,
    dayName,
    large,
    renderBadge,
    approved = true,
    bookmarked = false,
    linkProps = {},
    onBookmarkClick,
    ...props
  }) => {
    const superFancy = approved ? fancyLevel === 2 : false
    const textContentCss = [textContentStyle]

    if (large && superFancy) {
      textContentCss.push(textContentStyleLargeFancy)
    } else if (large) {
      textContentCss.push(textContentStyleLarge)
    }
    const inverted = superFancy ? theme.name !== "dark" : false

    return (
      <BaseBox
        fancyLevel={approved ? fancyLevel : 0}
        css={boxHoverStyle}
        {...props}
      >
        <div css={cardContent}>
          <a css={linkStyle} {...linkProps}>
            {!large && (
              <CalendarDay
                css={calendar}
                day={day}
                dayName={dayName}
                inverted={inverted}
              />
            )}
            <div css={textContentCss}>
              <SubTitle inverted={inverted}>{title}</SubTitle>
              <Description inverted={inverted}>
                {!!renderBadge && renderBadge({ inverted })}
                {description}
              </Description>
            </div>
          </a>
          <button
            css={[bookmark, bookmarked && bookmarkActive]}
            aria-label={
              bookmarked
                ? `Remove "${title}" from your bookmarks`
                : `Add "${title}" to your bookmarks`
            }
            onClick={onBookmarkClick}
          >
            <Bookmark bookmarked={bookmarked} />
          </button>
        </div>
      </BaseBox>
    )
  }
)
