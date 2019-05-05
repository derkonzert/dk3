// TODO: Refactor
const { parse: urlParse } = require("url")
const { HTTPStatusError } = require("@dk3/error")
const { sendText, sendRedirect } = require("@dk3/api-utils")
const { connect, dao } = require("@dk3/db")

// const cors = microCors({ allowMethods: ["GET"] })

let dbConnection

module.exports = async (req, res) => {
  const { query } = urlParse(req.url, true)
  const { url } = query

  try {
    if (!url || !url.trim()) {
      throw new HTTPStatusError({ title: "No url given", statusCode: 404 })
    }

    if (!dbConnection) {
      dbConnection = await connect()
    }

    const redirect = await dao.findRedirectByUrl(url)

    if (!redirect) {
      throw new HTTPStatusError({
        title: "Redirect not found",
        statusCode: 404,
      })
    }

    return sendRedirect(res, redirect.to)
  } catch (err) {
    if (err.statusCode) {
      sendText(res, err.statusCode, err.message)
    } else {
      sendText(res, 500, "Something went wrong.")
    }
  }
}
