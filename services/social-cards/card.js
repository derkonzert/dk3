const { error } = require("@dk3/logger")
const { url } = require("@dk3/config")
const { parse: urlParse } = require("url")
const { getScreenshot } = require("./getScreenshot")

module.exports = async (req, res) => {
  try {
    const { query } = urlParse(req.url, true)
    const { path } = query

    if (!path) {
      throw new Error("No path given")
    }

    const cardUrl = url(path)
    // const cardUrl = `http://localhost:3000/${url(path)}`
    const file = await getScreenshot(cardUrl, "png", false)

    res.statusCode = 200
    res.setHeader("Content-Type", "image/png")
    res.setHeader(
      "Cache-Control",
      "public, immutable, no-transform, s-maxage=31536000, max-age=31536000"
    )
    res.end(file)
  } catch (err) {
    res.statusCode = 500
    res.setHeader("Content-Type", "text/html")
    res.end("<h1>Internal Error</h1><p>Sorry, there was a problem</p>")
    await error(err)
  }
}
