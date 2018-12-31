const bcrypt = require("bcrypt")
const mongoose = require("mongoose")

const { config } = require("@dk3/config")

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },

  passwordHash: {
    type: String,
    required: true,
  },

  created: {
    type: Date,
    default: Date.now,
  },
})

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash)
}

UserSchema.statics.createPasswordHash = function(password) {
  return bcrypt.hashSync(password, config.get("PASSWORD_HASH_SALT_ROUNDS"))
}

exports.UserSchema = UserSchema

exports.User = mongoose.model("User", UserSchema)
