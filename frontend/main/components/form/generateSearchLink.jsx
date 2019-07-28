import { DateTime } from "luxon"

export const generateSearchLink = event => {
  const date = DateTime.fromISO(event.from)
  const query = encodeURIComponent(
    `${event.title} ${date.toFormat("dd.MM.yyyy")} ${event.location} München`
  )

  return `https://duckduckgo.com/?q=${query}`
}
