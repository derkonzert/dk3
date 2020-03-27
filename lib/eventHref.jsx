import slug from "slug"

const maxChars = string => string.substr(0, 80)

export const eventHref = (
  { title = "", location = "", id },
  prefix = "event"
) =>
  `/${prefix}/${maxChars(
    `${slug(title.trim()).toLowerCase()}-${slug(location.trim()).toLowerCase()}`
  )}-${id}`
