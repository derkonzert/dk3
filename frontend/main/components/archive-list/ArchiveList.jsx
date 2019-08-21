import React from "react"
import { DateTime } from "luxon"
import dynamic from "next/dynamic"
import gql from "graphql-tag"
import styled from "@emotion/styled"

const DynamicInView = dynamic(
  () =>
    import("react-intersection-observer").then(async mod => {
      if (typeof window.IntersectionObserver === "undefined") {
        await import("intersection-observer")
      }
      return mod.InView
    }),
  { ssr: false }
)

import { Query } from "react-apollo"
import { ErrorMessage } from "@dk3/ui/atoms/Message"
import { MegaTitle, Text, Strong, ListTitle } from "@dk3/ui/atoms/Typography"
import { Spinner } from "@dk3/ui/atoms/Spinner"
import { Flex } from "@dk3/ui/atoms/Flex"
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
    location
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
    <Spacer ma="xl">
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
                    <Flex mv="m" wrap="wrap">
                      {group.events.map(event => (
                        <BoxLink
                          key={event.id}
                          href={`${eventHref(event)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Box pa="s" mt="none" mb="s" mr="s">
                            <Text>{event.title}</Text>
                          </Box>
                        </BoxLink>
                      ))}
                    </Flex>
                  </React.Fragment>
                )
              })}

              {hasMore && (
                <DynamicInView
                  as="div"
                  onChange={inView => {
                    // if inView is true and it still hasMore
                    if (inView && hasMore) {
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
                    }
                  }}
                >
                  <Spacer pv="xl">
                    <Flex flexDirection="column" alignItems="center">
                      <Spinner />
                      <Flex>
                        <Text>… scanning through the archives.</Text>
                      </Flex>
                    </Flex>
                  </Spacer>
                </DynamicInView>
              )}
            </React.Fragment>
          )
        }}
      </Query>
    </Spacer>
  )
}
