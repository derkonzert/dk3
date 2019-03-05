let matchers = new Map()

export const getMatchMedia = mediaQuery => {
  if (!matchers.has(mediaQuery)) {
    matchers.set(mediaQuery, window.matchMedia(mediaQuery))
  }

  return matchers.get(mediaQuery)
}

export const isBreakpoint = mediaQuery => {
  if (typeof window === undefined) {
    return false
  }

  return getMatchMedia(mediaQuery).matches
}

export const isTablet = () => isBreakpoint("(min-width: 48em)")
