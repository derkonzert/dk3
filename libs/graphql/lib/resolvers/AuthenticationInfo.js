exports.AuthenticationInfo = {
  tokenExpiresAt: tokenPayload =>
    new Date(tokenPayload.exp * 1000).toISOString(),
  softExpiresAt: tokenPayload =>
    new Date(tokenPayload.softExpIn * 1000).toISOString(),
}
