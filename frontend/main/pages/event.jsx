import { withRouter } from "next/router"
import { ListAndDetail, ListAndDetailMain } from "@dk3/ui/layouts/ListAndDetail"

import { EventDetail } from "../components/event-detail/EventDetail"

export default withRouter(function Event({ router }) {
  return (
    <ListAndDetail>
      <ListAndDetailMain>
        <EventDetail id={router.query.eventId} />
      </ListAndDetailMain>
    </ListAndDetail>
  )
})
