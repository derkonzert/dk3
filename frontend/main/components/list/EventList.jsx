import React from "react"
import gql from "graphql-tag"
import { State } from "react-powerplug"

import {
  SegmentedControl,
  SegmentedControlOption,
} from "@dk3/ui/components/SegmentedControl"
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
    bookmarkedByMe
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

export const EventList = () => {
  return (
    <State initial={{ filter: "all" }}>
      {({ state, setState }) => (
        <React.Fragment>
          <SegmentedControl
            value={state.filter}
            name="filter"
            onChange={e => setState({ filter: e.target.value })}
          >
            <SegmentedControlOption value="all">All</SegmentedControlOption>
            <SegmentedControlOption value="mine">Mine</SegmentedControlOption>
          </SegmentedControl>

          <EventQueryList query={UPCOMING_EVENTS} filter={state.filter} />
        </React.Fragment>
      )}
    </State>
  )
}
