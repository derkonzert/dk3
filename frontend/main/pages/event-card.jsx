import { withRouter } from "next/router"

import { EventCardQuery } from "../components/event-detail/EventCard"

const EventPage = function Event({ router }) {
  return <EventCardQuery id={router.query.eventId} />
}

export default withRouter(EventPage)
