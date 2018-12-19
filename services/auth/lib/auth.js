"use strict";
process.env.SOME_AUTH_VAR = 123;

const config = require("@dk3/config");

module.exports = auth;

function auth() {
  // TODO
  return config.get("SOME_AUTH_VAR");
}
