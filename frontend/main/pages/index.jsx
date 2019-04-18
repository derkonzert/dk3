import React from "react"
import { withRouter } from "next/router"
import dynamic from "next/dynamic"

import {
  ListAndDetail,
  ListAndDetailMain,
  ListAndDetailSide,
} from "@dk3/ui/layouts/ListAndDetail"

import { EventList } from "../components/list/EventList"

import { VeryFancyButton } from "@dk3/ui/form/Button"
import { MegaTitle, Text } from "@dk3/ui/atoms/Typography"
import { Header } from "@dk3/ui/layouts/Header"
import { Spacer } from "@dk3/ui/atoms/Spacer"
import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"
import { eventHref } from "@dk3/shared-frontend/lib/eventHref"
import { EventLegend } from "../components/list/EventLegend"
import styled from "@emotion/styled"
import { HeaderMenu } from "../components/HeaderMenu/HeaderMenu"

const DynamicEventDetail = dynamic(() =>
  import("../components/event-detail/EventDetail").then(mod => mod.EventDetail)
)
const DynamicCreateEventForm = dynamic(() =>
  import("../components/form/CreateEventForm").then(mod => mod.CreateEventForm)
)

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
    router.push("/")
  }

  return (
    <ListAndDetail showDetail={showDetail}>
      <ListAndDetailMain>
        <HeaderMenu />
        <CurrentUser>
          {({ isLoggedIn }) => (
            <Header compact={isLoggedIn}>
              <MegaTitle>derkonzert</MegaTitle>

              <Text>
                {
                  "derkonzert is a simple list of concerts in Munich. It's supposed to be a haystack of needles, without any boundaries to any specific music style."
                }
              </Text>
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
            <DynamicEventDetail id={eventId} />
          </React.Fragment>
        )}
        {!!addEvent && (
          <DynamicCreateEventForm
            onCreated={event => {
              router.replace(`/?eventId=${event.id}`, eventHref(event), {
                shallow: true,
              })
            }}
          />
        )}
      </ListAndDetailSide>
    </ListAndDetail>
  )
})
