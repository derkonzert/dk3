import React from "react"
import { DateTime } from "luxon"
import Link from "next/link"
import gql from "graphql-tag"
import styled from "@emotion/styled"
import { Query } from "react-apollo"
import { ErrorMessage } from "@dk3/ui/atoms/Message"
import { MegaTitle, Text, Strong, ListTitle } from "@dk3/ui/atoms/Typography"
import { Spinner } from "@dk3/ui/atoms/Spinner"
import { Flex } from "@dk3/ui/atoms/Flex"
import { FancyButton } from "@dk3/ui/form/Button"
import { Box } from "@dk3/ui/atoms/Boxes"
import { Spacer } from "@dk3/ui/atoms/Spacer"
import { groupedEventsArchive } from "../list/eventDataHelper"
import { eventHref } from "@dk3/shared-frontend/lib/eventHref"

const BoxLink = styled.a`
  text-decoration: none;
  color: inherit;
`

export const ARCHIVED_EVENTS_EVENT_FRAGMENT = gql`
  fragment ArchivedEventsEventFragment on Event {
    __typename
    id
    title
    from
  }
`

export const ARCHIVED_EVENTS = gql`
  query allEvents($page: Int!) {
    pastEvents(page: $page) {
      events {
        ...ArchivedEventsEventFragment
      }
      hasMore
      nextPage
      totalCount
    }
  }
  ${ARCHIVED_EVENTS_EVENT_FRAGMENT}
`

export const ArchiveList = () => {
  return (
    <Spacer ma={5}>
      <MegaTitle>Archiv</MegaTitle>
      <Query
        query={ARCHIVED_EVENTS}
        variables={{ page: 0 }}
        fetchPolicy="cache-and-network"
      >
        {({ data, loading, error, fetchMore }) => {
          if (error) {
            return <ErrorMessage>{error.message}</ErrorMessage>
          }

          if (!data.pastEvents && loading) {
            return <Spinner />
          }

          const { events, hasMore, totalCount } = data.pastEvents

          return (
            <React.Fragment>
              <Text>
                There currently are <Strong>{totalCount}</Strong> events in the
                archive.
              </Text>

              {groupedEventsArchive(events, false).map(group => {
                const dt = DateTime.fromJSDate(group.date)

                return (
                  <React.Fragment key={group.date.getTime()}>
                    <ListTitle>
                      {dt.toLocaleString({ month: "long", year: "numeric" })}
                    </ListTitle>
                    <Flex mv={3} wrap="wrap">
                      {group.events.map(event => (
                        <Link
                          key={event.id}
                          href={`${eventHref(event)}`}
                          passHref
                        >
                          <BoxLink>
                            <Box pa={2} mt={0} mb={2} mr={2}>
                              <Text>{event.title}</Text>
                            </Box>
                          </BoxLink>
                        </Link>
                      ))}
                    </Flex>
                  </React.Fragment>
                )
              })}

              {hasMore && (
                <FancyButton
                  onClick={() => {
                    fetchMore({
                      variables: {
                        page: data.pastEvents.nextPage,
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (!fetchMoreResult) return prev
                        return Object.assign({}, prev, {
                          pastEvents: {
                            __typename: "ArchivedEvents",
                            events: [
                              ...prev.pastEvents.events,
                              ...fetchMoreResult.pastEvents.events,
                            ],
                            hasMore: fetchMoreResult.pastEvents.hasMore,
                            nextPage: fetchMoreResult.pastEvents.nextPage,
                            totalCount: fetchMoreResult.pastEvents.totalCount,
                          },
                        })
                      },
                    })
                  }}
                >
                  Fetch more events
                </FancyButton>
              )}
            </React.Fragment>
          )
        }}
      </Query>
    </Spacer>
  )
}
