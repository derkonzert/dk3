exports.authInfo = (_, args, context) => {
  if (context.user) {
    return context.user
  }
  return null
}
