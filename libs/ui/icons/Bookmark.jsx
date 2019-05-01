import React from "react"
import { useSpring, animated } from "react-spring"

export const Bookmark = React.memo(({ bookmarked, id }) => {
  const { transform } = useSpring({
    transform: bookmarked
      ? "translateY(0%) skewY(0deg)"
      : "translateY(120%) skewY(-20deg)",
  })

  return (
    <svg
      aria-hidden="true"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
    >
      <defs>
        <clipPath id={`drop-${id}`}>
          <path d="M336,0 L48,0 C21.49,0 0,21.49 0,48 L0,512 L192,400 L384,512 L384,48 C384,21.49 362.51,0 336,0 Z" />
        </clipPath>
      </defs>

      <g clipPath={`url(#drop-${id})`}>
        <animated.g fill="currentColor" style={{ transform }}>
          <path d="M336,0 L48,0 C21.49,0 0,21.49 0,48 L0,512 L192,400 L384,512 L384,48 C384,21.49 362.51,0 336,0 Z" />
        </animated.g>
        <g fill="currentColor">
          <path d="M336 0H48C21.49 0 0 21.49 0 48v464l192-112 192 112V48c0-26.51-21.49-48-48-48zm0 428.43l-144-84-144 84V54a6 6 0 0 1 6-6h276c3.314 0 6 2.683 6 5.996V428.43z" />
        </g>
      </g>
    </svg>
  )
})
