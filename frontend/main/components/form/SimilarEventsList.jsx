import React from "react"
import { useQuery } from "react-apollo"
import gql from "graphql-tag"
import { DateTime } from "luxon"

import { Spinner } from "@dk3/ui/atoms/Spinner"
import {
  ErrorMessage,
  SuccessMessage,
  WarningMessage,
} from "@dk3/ui/atoms/Message"
import { EventCard } from "@dk3/ui/components/EventCard"

export const SIMILAR_EVENTS = gql`
  query similarEvents($title: String!) {
    similarEvents(title: $title) {
      id
      title
      from
      to
      location
      approved
      fancyness
      bookmarkedByMe
    }
  }
`
export const SimilarEventsList = ({ title }) => {
  const { loading, error, data } = useQuery(SIMILAR_EVENTS, {
    variables: { title },
  })

  if (error) {
    return <ErrorMessage>Error loading event data</ErrorMessage>
  }
  if (loading) return <Spinner pv="xxl">Loading</Spinner>
  const { similarEvents } = data

  if (!similarEvents.length) {
    return <SuccessMessage>No similar event found</SuccessMessage>
  }

  return (
    <React.Fragment>
      <WarningMessage>
        There appears to be a similar event already in our database. Please
        check first!
      </WarningMessage>
      {similarEvents.map(event => {
        const luxonDate = DateTime.fromISO(event.from)

        return (
          <EventCard
            key={event.id}
            data-event
            data-event-approved={event.approved}
            id={event.id}
            title={event.title}
            day={luxonDate.toFormat("d")}
            description={`${event.location} — ${luxonDate.toFormat(
              "d.MM.y — HH:mm"
            )}`}
            dayName={luxonDate.toFormat("ccc")}
            approved={event.approved}
            bookmarked={event.bookmarkedByMe}
            fancyLevel={event.fancyness}
            bookmarkable={false}
          />
        )
      })}
    </React.Fragment>
  )
}
