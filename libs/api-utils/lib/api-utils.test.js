"use strict"

const { sendJson } = require("./api-utils")

describe("api-utils", () => {
  describe("sendJson", () => {
    /* res.writeHead(statusCode, { "Content-Type": "application/json" })
  res.end(JSON.stringify(data))*/

    it("writes the given status code and ends the response with json content", () => {
      const writeHead = jest.fn()
      const end = jest.fn()
      const statusCode = 401
      const data = { foo: "bar" }

      sendJson({ writeHead, end }, statusCode, data)

      expect(writeHead).toHaveBeenCalledWith(statusCode, {
        "Content-Type": "application/json",
      })

      expect(end).toHaveBeenCalledWith(JSON.stringify(data))
    })
  })
})
