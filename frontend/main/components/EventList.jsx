import React from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"

import { EventCard } from "@dk3/ui/components/EventCard"

export const allEventsQuery = gql`
  query allEvents {
    upcomingEvents {
      id
      title
      from
      location
    }
  }
`

export const EventList = () => {
  return (
    <Query query={allEventsQuery}>
      {({ loading, error, data: { upcomingEvents } }) => {
        if (error) return <span>Error loading posts.</span>
        if (loading) return <div>Loading</div>

        const fancyLevel = index =>
          index % 10 === 0 ? 2 : index % 7 === 0 ? 1 : 0

        return (
          <React.Fragment>
            {upcomingEvents.map((event, index) => {
              const date = new Date(event.from)

              return (
                <EventCard
                  title={event.title}
                  key={event.id}
                  large={index < 6}
                  day={date.getDay() + 1}
                  description={event.location}
                  dayName={date.toString().substr(0, 3)}
                  bookmarked={index % 7 === 0}
                  fancyLevel={fancyLevel(index)}
                />
              )
            })}
          </React.Fragment>
        )
      }}
    </Query>
  )
}
