import React from "react"
import { withRouter } from "next/router"
import { DateTime } from "luxon"
import gql from "graphql-tag"
import slug from "slug"

import { QueryWithAuthentication } from "@dk3/shared-frontend/lib/QueryWithAuthentication"
import { MutationWithAuthentication } from "@dk3/shared-frontend/lib/MutationWithAuthentication"

import { EventCard } from "@dk3/ui/components/EventCard"
import { ListTitle } from "@dk3/ui/atoms/Typography"
import { Spinner } from "@dk3/ui/atoms/Spinner"
import { RedBadge, GreenBadge } from "@dk3/ui/atoms/Badge"
import styled from "@emotion/styled"
import { groupedEvents } from "./eventDataHelper"

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

  @media screen and (min-width: 92em) {
    @supports (position: sticky) {
      background: transparent;
      backdrop-filter: none;
    }
  }
`

const EventSectionTitle = styled(ListTitle)`
  margin: 0;

  @media screen and (min-width: 92em) {
    @supports (position: sticky) {
      padding: 0 1.5rem;
      transform: translateX(-100%);
      text-align: right;
    }
  }
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

const twelveOurs = 1000 * 60 * 60 * 12

export const EventQueryList = withRouter(({ query, filter, router }) => {
  return (
    <QueryWithAuthentication
      required={filter === "mine"}
      query={query}
      variables={{ filter }}
      ssr={false}
      fetchPolicy={filter === "mine" ? "cache-and-network" : "cache-first"}
    >
      {({ loading, error, data }) => {
        if (error) return <span>Error loading posts.</span>
        if (loading) return <Spinner mt={5} mb={7} />

        const { upcomingEvents } = data

        return (
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
                    <span style={{ color: "#757575" }}>
                      {group.date.getFullYear()}
                    </span>
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
                            renderBadge={({ inverted }) => {
                              if (!event.approved) {
                                return (
                                  <RedBadge inverted={inverted}>
                                    Not yet verified!
                                  </RedBadge>
                                )
                              }

                              if (event.recentlyAdded) {
                                return (
                                  <GreenBadge inverted={inverted}>
                                    New!
                                  </GreenBadge>
                                )
                              }

                              return null
                            }}
                            linkProps={{
                              href: `/c/${slug(event.title)}-${event.id}`,
                              onClick: e => {
                                e.preventDefault()

                                router.push(
                                  `/?eventId=${event.id}`,
                                  `/c/${slug(event.title)}-${event.id}`,
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
                </EventSection>
              )
            })}
          </React.Fragment>
        )
      }}
    </QueryWithAuthentication>
  )
})
