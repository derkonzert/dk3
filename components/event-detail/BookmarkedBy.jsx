import React from "react"

import { Strong } from "@dk3/ui/atoms/Typography"

export const BookmarkedBy = ({ author, users }) => {
  const filteredUsers = users
    .filter(user => user.username)
    .filter(user => !author || user.id !== author.id)
    .sort((a, b) => (a.username > b.username ? 1 : -1))

  const anonymousUsers = users
    .filter(user => !user.username)
    .filter(user => !author || user.id !== author.id)

  if (!filteredUsers.length && !anonymousUsers.length) {
    return null
  }

  return (
    <React.Fragment>
      {" — bookmarked by "}
      {filteredUsers.map((user, index) => (
        <span key={user.id}>
          <Strong>{user.username}</Strong>
          {index < filteredUsers.length - 1 &&
            (index + 2 === filteredUsers.length
              ? anonymousUsers.length
                ? ", "
                : " and "
              : ", ")}
        </span>
      ))}
      {anonymousUsers.length
        ? `${filteredUsers.length ? " and " : ""}anonymous users.`
        : "."}
    </React.Fragment>
  )
}
