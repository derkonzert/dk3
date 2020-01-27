import { withRouter } from "next/router"

import { EventCardQuery } from "../components/event-detail/EventCard"

const extractIdFromPath = path => {
  const match = path.match(/\/event\/(.)*-(?<eventId>.*)$/)
  if (match) {
    return match[2]
  } else {
    return undefined
  }
}

const EventPage = function Event({ router }) {
  const eventId = !router.query.eventId
    ? extractIdFromPath(router.asPath)
    : router.query.eventId

  return <EventCardQuery id={eventId} />
}

export default withRouter(EventPage)
