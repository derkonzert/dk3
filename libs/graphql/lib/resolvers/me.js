exports.me = async (_, args, context) => {
  if (context.user) {
    return await context.dao.userById(context.user._id)
  }
  return null
}
