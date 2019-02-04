import { withRouter } from "next/router"
import Link from "next/link"
import { ListAndDetail, ListAndDetailMain } from "@dk3/ui/layouts/ListAndDetail"

import { EventList } from "../components/list/EventList"
import { WhoAmI } from "../components/WhoAmI"
import { CreateEventForm } from "../components/form/CreateEventForm"
import { EventDetail } from "../components/event-detail/EventDetail"
import { Dialog } from "@dk3/ui/components/Dialog"

export default withRouter(function Index({ router }) {
  return (
    <ListAndDetail>
      <ListAndDetailMain>
        <WhoAmI />
        <EventList />
        <CreateEventForm />
        {!!router.query.eventId && (
          <Dialog>
            <EventDetail id={router.query.eventId} />
            <Link href="/">
              <a
                onClick={e => {
                  e.preventDefault()
                  router.back()
                }}
              >
                Back
              </a>
            </Link>
          </Dialog>
        )}
      </ListAndDetailMain>
    </ListAndDetail>
  )
})
