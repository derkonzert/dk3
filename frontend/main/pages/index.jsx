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
import { MegaTitle, Text } from "@dk3/ui/atoms/Typography"
import { Header } from "@dk3/ui/layouts/Header"
import { Spacer } from "@dk3/ui/atoms/Spacer"
import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"
import { EventLegend } from "../components/list/EventLegend"
import styled from "@emotion/styled"

const NOT_FINAL_AddEventButton = styled(VeryFancyButton)`
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 12;
`

export default withRouter(function Index({ router }) {
  const {
    query: { eventId, addEvent },
  } = router
  const showDetail = !!eventId || !!addEvent
  const closeDetail = e => {
    e.preventDefault()
    router.back()
  }

  return (
    <ListAndDetail showDetail={showDetail}>
      <ListAndDetailMain>
        <CurrentUser>
          {({ isLoggedIn }) => (
            <Header loggedIn={isLoggedIn}>
              <MegaTitle>derkonzert</MegaTitle>
              {!isLoggedIn && (
                <Text>
                  {
                    "derkonzert is a simple list of concerts in Munich. It's supposed to be a haystack of needles, without any boundaries to any specific music style."
                  }
                </Text>
              )}
              <WhoAmI />
            </Header>
          )}
        </CurrentUser>
        <Spacer pa={4}>
          <EventList />
          <EventLegend />
          <NOT_FINAL_AddEventButton
            data-add-event
            pa={4}
            onClick={() => {
              router.push(`/?addEvent=1`, `/add-new-event`, {
                shallow: true,
              })
            }}
          >
            Add Event
          </NOT_FINAL_AddEventButton>
        </Spacer>
      </ListAndDetailMain>
      <ListAndDetailSide requestClose={closeDetail}>
        {!!eventId && (
          <React.Fragment>
            <EventDetail id={eventId} />
            <Link href="/">
              <a onClick={closeDetail}>Back</a>
            </Link>
          </React.Fragment>
        )}
        {!!addEvent && (
          <CreateEventForm
            onCreated={event => {
              router.replace(
                `/?eventId=${event.id}`,
                `/c/${event.title}-${event.id}`,
                {
                  shallow: true,
                }
              )
            }}
          />
        )}
      </ListAndDetailSide>
    </ListAndDetail>
  )
})
