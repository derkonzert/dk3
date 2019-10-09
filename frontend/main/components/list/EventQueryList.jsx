import React from "react"
import { withRouter } from "next/router"
import Link from "next/link"
import { DateTime } from "luxon"
import gql from "graphql-tag"

import { QueryWithAuthentication } from "@dk3/shared-frontend/lib/QueryWithAuthentication"
import { MutationWithAuthentication } from "@dk3/shared-frontend/lib/MutationWithAuthentication"
import { eventHref } from "@dk3/shared-frontend/lib/eventHref"

import { EventCard } from "@dk3/ui/components/EventCard"
import { ListTitle, ListTitleAppendix } from "@dk3/ui/atoms/Typography"
import { Spinner } from "@dk3/ui/atoms/Spinner"
import { DangerBadge, SuccessBadge } from "@dk3/ui/atoms/Badge"
import styled from "@emotion/styled"
import { groupedEvents } from "./eventDataHelper"
import { AddEventButton } from "@dk3/ui/components/AddEventButton"

const EventSection = styled.div`
  position: relative;
`

const EventSectionHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  margin: 1.5rem -1rem;
  padding: 1rem;

  background: ${({ theme }) => theme.colors.stickyListTitleBackground};
  backdrop-filter: blur(4px);
`

const EventSectionTitle = styled(ListTitle)`
  margin: 0;
`

export const BOOKMARK_EVENT = gql`
  mutation bookmarkEvent($input: BookmarkEventInput!) {
    bookmarkEvent(input: $input) {
      id
      bookmarkedByMe
      fancyness
    }
  }
`

const ensureDoubles = int => `${int <= 9 ? "0" : ""}${int}`
const twelveOurs = 1000 * 60 * 60 * 12

export const EventQueryList = withRouter(({ query, filter, router }) => {
  return (
    <QueryWithAuthentication
      required={filter === "mine"}
      query={query}
      variables={{ filter }}
      ssr={false}
      notLoggedInMessage="You need an account to view your bookmarked events."
      fetchPolicy={filter === "mine" ? "cache-and-network" : "cache-first"}
    >
      {({ loading, error, data }) => {
        if (error) return <span>Error loading posts.</span>
        if (loading) return <Spinner mt="xl" mb="xxxl" />

        const { upcomingEvents } = data

        return (
          <MutationWithAuthentication
            notLoggedInMessage="Bookmarking an event is only possible when logged in"
            mutation={BOOKMARK_EVENT}
          >
            {bookmarkEvent => (
              <React.Fragment>
                {groupedEvents(upcomingEvents).map(group => {
                  let groupName
                  const dt = DateTime.fromJSDate(group.date)

                  if (group.isToday) {
                    groupName = <EventSectionTitle>Today</EventSectionTitle>
                  } else if (group.isTomorrow) {
                    groupName = <EventSectionTitle>Tomorrow</EventSectionTitle>
                  } else {
                    groupName = (
                      <EventSectionTitle>
                        {dt.toLocaleString({ month: "long" })}{" "}
                        <ListTitleAppendix>
                          {group.date.getFullYear()}
                        </ListTitleAppendix>
                      </EventSectionTitle>
                    )
                  }

                  return (
                    <EventSection key={dt.toString()}>
                      <EventSectionHeader>{groupName}</EventSectionHeader>
                      {group.events.map(event => {
                        const date = new Date(event.from)
                        const to = new Date(event.to)
                        const isRange = to - date > twelveOurs

                        const dayName = isRange
                          ? `${to.getDate() - date.getDate() + 1} days`
                          : date.toString().substr(0, 3)

                        const doorTime = `${ensureDoubles(
                          date.getHours()
                        )}:${ensureDoubles(date.getMinutes())}`

                        return (
                          <EventCard
                            key={event.id}
                            data-event
                            data-event-approved={event.approved}
                            large={group.isToday || group.isTomorrow}
                            id={event.id}
                            title={event.title}
                            day={date.getDate()}
                            description={`${event.location} — ${doorTime}`}
                            dayName={dayName}
                            approved={event.approved}
                            bookmarked={event.bookmarkedByMe}
                            fancyLevel={event.fancyness}
                            renderBadge={({ inverted }) => {
                              if (!event.approved) {
                                return (
                                  <DangerBadge inverted={inverted}>
                                    Not yet verified!
                                  </DangerBadge>
                                )
                              }

                              if (event.canceled) {
                                return (
                                  <DangerBadge inverted={inverted}>
                                    Canceled!
                                  </DangerBadge>
                                )
                              }

                              if (event.postponed) {
                                return (
                                  <DangerBadge inverted={inverted}>
                                    Postponed!
                                  </DangerBadge>
                                )
                              }

                              if (event.recentlyAdded) {
                                return (
                                  <SuccessBadge inverted={inverted}>
                                    New!
                                  </SuccessBadge>
                                )
                              }

                              return null
                            }}
                            linkProps={{
                              href: eventHref(event),
                              onClick: e => {
                                e.preventDefault()

                                router.push(
                                  `/?eventId=${event.id}${
                                    filter === "mine" ? "&showMine=1" : ""
                                  }`,
                                  eventHref(event),
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
                                optimisticResponse: {
                                  __typename: "Mutation",
                                  bookmarkEvent: {
                                    __typename: "Event",
                                    ...event,
                                    bookmarkedByMe: !event.bookmarkedByMe,
                                  },
                                },
                              })
                            }}
                          />
                        )
                      })}
                    </EventSection>
                  )
                })}
                <Link href="/?addEvent=1" as="/add-new-event" passHref>
                  <AddEventButton data-add-event pa="l" title="Add a new event">
                    +
                  </AddEventButton>
                </Link>
              </React.Fragment>
            )}
          </MutationWithAuthentication>
        )
      }}
    </QueryWithAuthentication>
  )
})
