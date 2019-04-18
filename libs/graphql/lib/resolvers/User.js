const onlyAllowForOwner = property => (user, _args, { user: viewer }) => {
  if (!viewer) {
    return null
  }
  if (viewer.shortId === user.shortId) {
    return user[property]
  }

  return null
}

module.exports.User = {
  id: user => {
    return user.shortId
  },
  username: (user, _args, { user: viewer }) => {
    if (user.publicUsername) {
      return user.username
    }

    if (!viewer) {
      return null
    }

    if (viewer.shortId === user.shortId) {
      return user.username
    }

    return null
  },
  email: onlyAllowForOwner("email"),
  sendEmails: onlyAllowForOwner("sendEmails"),
  skills: onlyAllowForOwner("skills"),
  calendarToken: onlyAllowForOwner("calendarToken"),
}
