exports.sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" })
  res.end(JSON.stringify(data))
}
