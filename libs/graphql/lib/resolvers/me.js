exports.me = async (_, args, context) => {
  if (context.user) {
    return await context.db.userById(context.user._id)
  }
  return null
}
