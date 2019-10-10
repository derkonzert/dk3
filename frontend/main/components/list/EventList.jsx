import React, { useState, useEffect } from "react"
import gql from "graphql-tag"
import { withRouter } from "next/router"

import {
  SegmentedControl,
  SegmentedControlOption,
} from "@dk3/ui/form/SegmentedControl"
import { SentryErrorBoundary } from "@dk3/shared-frontend/lib/SentryErrorBoundary"

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
  query allEvents($filter: String!, $skip: Int!) {
    upcomingEvents(filter: $filter, skip: $skip, limit: 5) {
      hasMore
      events {
        ...UpcomingEventsEvent
      }
    }
  }
  ${UPCOMING_EVENTS_EVENT_FRAGMENT}
`

export const EventList = withRouter(({ router }) => {
  const filter = router.query.showMine ? "mine" : "all"
  const [skip, setSkip] = useState(0)

  useEffect(() => {
    setSkip(0)
  }, [filter])

  return (
    <SentryErrorBoundary>
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

      <EventQueryList query={UPCOMING_EVENTS} skip={skip} filter={filter} />
    </SentryErrorBoundary>
  )
})
