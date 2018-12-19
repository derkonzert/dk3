const { me } = require("./me");
const { User } = require("./User");

module.exports = {
  Query: {
    me
  },
  /* Type Resolvers */
  User
};
