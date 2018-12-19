const { dao } = require("@dk3/db");

exports.me = async (_, args, context) => {
  if (context.user) {
    return await dao.userById(context.user._id);
  }
  return null;
};
