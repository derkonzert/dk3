import React from "react"

import gql from "graphql-tag"
import { Query } from "react-apollo"
import { ErrorMessage } from "@dk3/ui/atoms/Message"
import { MegaTitle, Text, Strong } from "@dk3/ui/atoms/Typography"
import { Spinner } from "@dk3/ui/atoms/Spinner"
import { Flex } from "@dk3/ui/atoms/Flex"
import { FancyButton } from "@dk3/ui/form/Button"
import { Box } from "@dk3/ui/atoms/Boxes"
import { Spacer } from "@dk3/ui/atoms/Spacer"

export const ARCHIVED_EVENTS_EVENT_FRAGMENT = gql`
  fragment ArchivedEventsEventFragment on Event {
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

              <Flex mv={4} wrap="wrap">
                {events.map(event => (
                  <Box pa={3} mt={0} mh={2} key={event.id}>
                    {event.title}
                  </Box>
                ))}
              </Flex>

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
