import React from "react"
import gql from "graphql-tag"
import { withRouter } from "next/router"

import {
  SegmentedControl,
  SegmentedControlOption,
} from "@dk3/ui/form/SegmentedControl"
import { EventQueryList } from "./EventQueryList"

export const UPCOMING_EVENTS_EVENT_FRAGMENT = gql`
  fragment UpcomingEventsEvent on Event {
    __typename
    id
    title
    from
    to
    location
    fancyness
    approved
    postponed
    canceled
    bookmarkedByMe
    recentlyAdded
  }
`

export const UPCOMING_EVENTS = gql`
  query allEvents($filter: String!) {
    upcomingEvents(filter: $filter) {
      ...UpcomingEventsEvent
    }
  }
  ${UPCOMING_EVENTS_EVENT_FRAGMENT}
`

export const EventList = withRouter(({ router }) => {
  const filter = router.query.showMine ? "mine" : "all"

  return (
    <React.Fragment>
      <SegmentedControl
        value={filter}
        name="filter"
        onChange={e => {
          if (e.target.value === "mine") {
            router.push("/?showMine=true", "/mine")
          } else {
            router.push("/", "/")
          }
        }}
      >
        <SegmentedControlOption value="all">All</SegmentedControlOption>
        <SegmentedControlOption value="mine">Mine</SegmentedControlOption>
      </SegmentedControl>

      <EventQueryList query={UPCOMING_EVENTS} filter={filter} />
    </React.Fragment>
  )
})
