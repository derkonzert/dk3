import React from "react"
import { withRouter } from "next/router"
import { DateTime } from "luxon"
import gql from "graphql-tag"

import { QueryWithAuthentication } from "@dk3/shared-frontend/lib/QueryWithAuthentication"
import { MutationWithAuthentication } from "@dk3/shared-frontend/lib/MutationWithAuthentication"

import { EventCard } from "@dk3/ui/components/EventCard"
import { StickyListTitle } from "@dk3/ui/atoms/Typography"
import { Spinner } from "@dk3/ui/atoms/Spinner"

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

const isToday = date => new Date().toDateString() === date.toDateString()
const isTomorrow = date =>
  new Date(Date.now() + 86400000).toDateString() === date.toDateString()

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
        if (loading) return <Spinner mt={5} mb={7} />

        const { upcomingEvents } = data
        let lastEventDate

        return (
          <React.Fragment>
            {upcomingEvents
              .sort(sortEvents)
              .reduce((groups, event) => {
                const currentMonth = groups[groups.length - 1]
                const eventFrom = new Date(event.from)

                if (!currentMonth) {
                  groups.push({
                    date: eventFrom,
                    isToday: isToday(eventFrom),
                    isTomorrow: isTomorrow(eventFrom),
                    events: [event],
                  })
                } else if (
                  (isToday(currentMonth.date) && isToday(eventFrom)) ||
                  (isTomorrow(currentMonth.date) && isTomorrow(eventFrom))
                ) {
                  groups[groups.length - 1].events.push(event)
                } else if (
                  (isToday(lastEventDate) && !isToday(eventFrom)) ||
                  (isTomorrow(lastEventDate) && !isTomorrow(eventFrom))
                ) {
                  groups.push({
                    date: eventFrom,
                    isToday: isToday(eventFrom),
                    isTomorrow: isTomorrow(eventFrom),
                    events: [event],
                  })
                } else if (
                  !isToday(eventFrom) &&
                  !isTomorrow(eventFrom) &&
                  currentMonth.date.getMonth() !== eventFrom.getMonth()
                ) {
                  groups.push({
                    date: eventFrom,
                    isToday: isToday(eventFrom),
                    isTomorrow: isTomorrow(eventFrom),
                    events: [event],
                  })
                } else {
                  groups[groups.length - 1].events.push(event)
                }

                lastEventDate = eventFrom

                return groups
              }, [])
              .map(group => {
                let groupName
                const dt = DateTime.fromJSDate(group.date)

                if (group.isToday) {
                  groupName = <StickyListTitle>Today</StickyListTitle>
                } else if (group.isTomorrow) {
                  groupName = <StickyListTitle>Tomorrow</StickyListTitle>
                } else {
                  groupName = (
                    <StickyListTitle>
                      {dt.toLocaleString({ month: "long" })}{" "}
                      <span style={{ color: "#757575" }}>
                        {group.date.getFullYear()}
                      </span>
                    </StickyListTitle>
                  )
                }

                return (
                  <div key={dt.toString()}>
                    {groupName}
                    {group.events.map(event => {
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
                              data-event
                              data-event-approved={event.approved}
                              large={group.isToday || group.isTomorrow}
                              title={event.title}
                              day={date.getDate()}
                              description={event.location}
                              dayName={dayName}
                              approved={event.approved}
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
                  </div>
                )
              })}
          </React.Fragment>
        )
      }}
    </QueryWithAuthentication>
  )
})
