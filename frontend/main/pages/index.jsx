import React from "react"
import { withRouter } from "next/router"
import Link from "next/link"
import {
  ListAndDetail,
  ListAndDetailMain,
  ListAndDetailSide,
} from "@dk3/ui/layouts/ListAndDetail"

import { EventList } from "../components/list/EventList"
import { WhoAmI } from "../components/WhoAmI"
import { CreateEventForm } from "../components/form/CreateEventForm"
import { EventDetail } from "../components/event-detail/EventDetail"
import { VeryFancyButton } from "@dk3/ui/form/Button"

export default withRouter(function Index({ router }) {
  const {
    query: { eventId, addEvent },
  } = router
  const showDetail = !!eventId || !!addEvent

  return (
    <ListAndDetail showDetail={showDetail}>
      <ListAndDetailMain>
        <WhoAmI />
        <EventList />
        <VeryFancyButton
          onClick={() => {
            router.push(`/?addEvent=1`, `/add-new-event`, {
              shallow: true,
            })
          }}
        >
          Add Event
        </VeryFancyButton>
      </ListAndDetailMain>
      <ListAndDetailSide>
        {!!eventId && (
          <React.Fragment>
            <EventDetail id={eventId} />
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
          </React.Fragment>
        )}
        {!!addEvent && <CreateEventForm />}
      </ListAndDetailSide>
    </ListAndDetail>
  )
})
