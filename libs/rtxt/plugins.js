export const matchRegexp = regexp => string => {
  const result = regexp.exec(string)
  regexp.lastIndex = 0
  return result
}

export class BasePlugin {
  constructor({ name, test, renderer, priority = 0, meta }) {
    this.name = name
    this.test = test
    this.renderer = renderer
    this.priority = priority
    this.meta = meta
  }

  createCopy({ name, test, priority, renderer, meta }) {
    return new BasePlugin({
      name: name || this.name,
      test: test || this.test,
      renderer: renderer || this.renderer,
      priority: priority || this.priority,
      meta: meta || this.meta,
    })
  }

  render(...args) {
    return this.renderer(...args)
  }
}

BasePlugin.create = ({ name, test, renderer, priority = 0 }) =>
  new BasePlugin({
    name,
    test,
    renderer,
    priority,
  })

export const defaultPlugin = BasePlugin.create({
  name: "default",
  test: ({ line }) => ({
    matches: true,
    skipLine: true,
    value: line,
  }),
  renderer: token => token.value,
  priority: -1,
})

export const Headlines = BasePlugin.create({
  name: "headline",
  test: ({ word, wordIndex, line }) => {
    if (wordIndex === 0) {
      let headlineType

      switch (word) {
        case "#":
          headlineType = "h1"
          break
        case "##":
          headlineType = "h2"
          break
        case "###":
          headlineType = "h3"
          break
        default:
        // Fall through is intended
      }

      if (headlineType) {
        return {
          value: { headlineType, line: line.substr(word.length + 1) },
          skipLine: true,
        }
      }
    }
  },
  renderer: token =>
    `<${token.value.headlineType}>${token.value.line}</${
      token.value.headlineType
    }>`,
})

const youTubeMatcher = matchRegexp(
  /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/gi
)
export const YouTube = BasePlugin.create({
  name: "youtube",
  test: ({ word }) => {
    const match = youTubeMatcher(word)
    if (match) {
      return {
        value: { id: match[1] },
      }
    }
  },
  priority: 10,
  renderer: token =>
    `<iframe src="https://www.youtube.com/embed/${token.value.id}" />`,
})

const vimeoMatcher = matchRegexp(/https?:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/)
export const Vimeo = BasePlugin.create({
  name: "vimeo",
  test: ({ word }) => {
    const match = vimeoMatcher(word)
    if (match) {
      return {
        value: { id: match[2] },
      }
    }
  },
  priority: 10,
  renderer: token =>
    `<iframe src="https://player.vimeo.com/video/${token.value.id}" />`,
})

const linkRegexMatcher = matchRegexp(
  // eslint-disable-next-line no-useless-escape
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
)

export const Link = BasePlugin.create({
  name: "link",
  test: ({ word }) => {
    const match = linkRegexMatcher(word)

    if (match) {
      return {
        value: { href: match[0] },
      }
    }
  },
  priority: 5,
  renderer: token => `<a href="${token.value.href}">${token.value.href}</a>`,
})
