const { createTokens, renderTokens } = require("./rtxt")
const { defaultPlugin, Headlines, YouTube, Vimeo, Link } = require("./plugins")

describe("rtxt", () => {
  const multilineString = `# this is a 
      
      multiline string`
  const multilineStringWithYoutubeVideo = `
    https://www.youtube.com/watch?v=c4eO2o9u1j0`

  const youtubeVideoInSentence = `
  What should happen https://www.youtube.com/watch?v=c4eO2o9u1j0 here?`

  const multipleYoutubeVideosInSentence =
    "What should happen https://www.youtube.com/watch?v=c4eO2o9u1j0 here or https://www.youtube.com/watch?v=f8eO5o3u1b3 here?"

  const multipleYoutubeVideosInSentenceWithHeadlineAndLink = `# This is a
  
  What should happen https://www.youtube.com/watch?v=c4eO2o9u1j0 here or https://derkonzert.de/about here?
  
  https://vimeo.com/2707962`

  describe("createTokens", () => {
    it("creates an array of tokens from a string", () => {
      expect(createTokens("")).toBeInstanceOf(Array)
    })

    it("by default creates default tokens per line", () => {
      const lines = createTokens(multilineString)

      expect(lines.length).toBe(3)

      for (let line of lines) {
        expect(line[0].type).toBe(defaultPlugin.name)
        expect(line[0].plugin).toBe(defaultPlugin)
      }
    })

    it("detects headlines", () => {
      const lines = createTokens(multilineString, [Headlines])

      expect(lines.length).toBe(3)

      for (let line of lines) {
        if (lines.indexOf(line) === 0) {
          expect(line[0].type).toBe(Headlines.name)
          expect(line[0].plugin).toBe(Headlines)
        } else {
          expect(line[0].type).toBe(defaultPlugin.name)
          expect(line[0].plugin).toBe(defaultPlugin)
        }
      }
    })

    it("detects youtube videos", () => {
      const lines = createTokens(multilineStringWithYoutubeVideo, [
        Headlines,
        YouTube,
      ])

      expect(lines.length).toBe(2)

      for (let line of lines) {
        if (lines.indexOf(line) === 0) {
          expect(line[0].type).toBe(defaultPlugin.name)
          expect(line[0].plugin).toBe(defaultPlugin)
        } else {
          expect(line[0].type).toBe(YouTube.name)
          expect(line[0].plugin).toBe(YouTube)
        }
      }
    })

    it("inserts default plugin in line when youtube videos detected within sentence", () => {
      const lines = createTokens(youtubeVideoInSentence, [Headlines, YouTube])

      expect(lines.length).toBe(2)

      for (let line of lines) {
        if (lines.indexOf(line) === 1) {
          expect(line[0].plugin).toBe(defaultPlugin)
          expect(line[0].value).toBe("What should happen")

          expect(line[1].plugin).toBe(YouTube)
          expect(line[1].value).toEqual(
            expect.objectContaining({ id: "c4eO2o9u1j0" })
          )

          expect(line[2].plugin).toBe(defaultPlugin)
          expect(line[2].value).toBe("here?")
        } else {
          expect(line[0].type).toBe(defaultPlugin.name)
          expect(line[0].plugin).toBe(defaultPlugin)
        }
      }
    })

    it("handles multiple token matches in line", () => {
      const lines = createTokens(multipleYoutubeVideosInSentence, [YouTube])
      expect(lines.length).toBe(1)

      const line = lines[0]

      expect(line[0].plugin).toBe(defaultPlugin)
      expect(line[0].value).toBe("What should happen")

      expect(line[1].plugin).toBe(YouTube)
      expect(line[1].value).toEqual(
        expect.objectContaining({ id: "c4eO2o9u1j0" })
      )

      expect(line[2].plugin).toBe(defaultPlugin)
      expect(line[2].value).toBe("here or")

      expect(line[3].plugin).toBe(YouTube)
      expect(line[3].value).toEqual(
        expect.objectContaining({ id: "f8eO5o3u1b3" })
      )

      expect(line[4].plugin).toBe(defaultPlugin)
      expect(line[4].value).toBe("here?")
    })
  })

  describe("renderTokens", () => {
    it("should render them correctly…", () => {
      const tokens = createTokens(
        multipleYoutubeVideosInSentenceWithHeadlineAndLink,
        [Headlines, YouTube, Link, Vimeo]
      )

      expect(renderTokens(tokens)).toBe(`<h1>This is a</h1>

What should happen <iframe src="https://www.youtube.com/embed/c4eO2o9u1j0" /> here or <a href="https://derkonzert.de/about">https://derkonzert.de/about</a> here?

<iframe src="https://player.vimeo.com/video/2707962" />`)
    })
  })
})
