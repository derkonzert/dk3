import React from "react"
import { withRouter } from "next/router"

import gql from "graphql-tag"

import { QueryWithAuthentication } from "../../lib/QueryWithAuthentication"
import { MutationWithAuthentication } from "../../lib/MutationWithAuthentication"

import { EventCard } from "@dk3/ui/components/EventCard"
import { Description } from "@dk3/ui/atoms/Typography"

export const BOOKMARK_EVENT = gql`
  mutation bookmarkEvent($input: BookmarkEventInput!) {
    bookmarkEvent(input: $input) {
      id
      bookmarkedByMe
      fancyness
    }
  }
`

const sortEvents = (a, b) => {
  const dateSort = new Date(a.from).getTime() - new Date(b.from).getTime()
  if (dateSort !== 0) {
    return dateSort
  }

  return a.title > b.title ? 1 : -1
}

export const EventQueryList = withRouter(({ query, filter, router }) => {
  return (
    <QueryWithAuthentication
      required={filter === "mine"}
      query={query}
      variables={{ filter }}
      fetchPolicy={filter === "mine" ? "cache-and-network" : "cache-first"}
    >
      {({ loading, error, data }) => {
        if (error) return <span>Error loading posts.</span>
        if (loading) return <div>Loading</div>

        const { upcomingEvents } = data

        return (
          <React.Fragment>
            {upcomingEvents
              .sort(sortEvents)
              .reduce((months, event) => {
                const currentMonth = months[months.length - 1]

                if (!currentMonth) {
                  months.push({
                    date: new Date(event.from),
                    events: [event],
                  })
                } else if (
                  currentMonth.date.getMonth() !==
                  new Date(event.from).getMonth()
                ) {
                  months.push({
                    date: new Date(event.from),
                    events: [event],
                  })
                } else {
                  months[months.length - 1].events.push(event)
                }

                return months
              }, [])
              .map(month => {
                const monthName = month.date.toString().substr(4, 3)

                return (
                  <React.Fragment key={monthName}>
                    <Description>
                      {monthName} {month.date.getFullYear()}
                    </Description>
                    {month.events.map(event => {
                      const date = new Date(event.from)
                      const to = new Date(event.to)
                      const isRange = date.getDate() !== to.getDate()

                      const dayName = isRange
                        ? `${to.getDate() - date.getDate() + 1} days`
                        : date.toString().substr(0, 3)

                      return (
                        <MutationWithAuthentication
                          notLoggedInMessage="Bookmarking an event is only possible when logged in"
                          mutation={BOOKMARK_EVENT}
                          key={event.id}
                          optimisticResponse={{
                            __typename: "Mutation",
                            bookmarkEvent: {
                              __typename: "Event",
                              ...event,
                              bookmarkedByMe: !event.bookmarkedByMe,
                            },
                          }}
                        >
                          {bookmarkEvent => (
                            <EventCard
                              title={event.title}
                              day={date.getDate()}
                              description={event.location}
                              dayName={dayName}
                              bookmarked={event.bookmarkedByMe}
                              fancyLevel={event.fancyness}
                              linkProps={{
                                href: `/c/${event.title}-${event.id}`,
                                onClick: e => {
                                  e.preventDefault()

                                  router.push(
                                    `/?eventId=${event.id}`,
                                    `/c/${event.title}-${event.id}`,
                                    {
                                      shallow: true,
                                    }
                                  )
                                },
                              }}
                              onBookmarkClick={() => {
                                bookmarkEvent({
                                  variables: {
                                    input: {
                                      id: event.id,
                                      bookmarked: !event.bookmarkedByMe,
                                    },
                                  },
                                })
                              }}
                            />
                          )}
                        </MutationWithAuthentication>
                      )
                    })}
                  </React.Fragment>
                )
              })}
          </React.Fragment>
        )
      }}
    </QueryWithAuthentication>
  )
})
