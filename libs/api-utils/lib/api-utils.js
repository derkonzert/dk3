exports.sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" })
  res.end(JSON.stringify(data))
}

exports.sendText = (res, statusCode, text) => {
  res.writeHead(statusCode)
  res.end(text)
}

exports.sendRedirect = (res, Location, statusCode = 301) => {
  res.writeHead(statusCode, { Location })
  res.end()
}
