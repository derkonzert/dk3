import React from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"

import { MegaTitle, Text, WrappingText } from "@dk3/ui/atoms/Typography"
import { Spinner } from "@dk3/ui/atoms/Spinner"
import { Spacer } from "@dk3/ui/atoms/Spacer"

export const EVENT_DETAIL_FRAGMENT = gql`
  fragment EventDetailEvent on Event {
    __typename
    id
    title
    description
    from
    to
    location
    fancyness
    bookmarkedByMe
  }
`

export const EVENT_DETAIL = gql`
  query eventDetail($id: ID!) {
    event(id: $id) {
      ...EventDetailEvent
    }
  }
  ${EVENT_DETAIL_FRAGMENT}
`

export const EventDetail = ({ id }) => {
  return (
    <Query query={EVENT_DETAIL} variables={{ id }}>
      {({ loading, error, data }) => {
        if (error) return <span>Error loading posts.</span>
        if (loading) return <Spinner>Loading</Spinner>

        const { event } = data

        return (
          <Spacer pa={4}>
            <MegaTitle mb={3}>{event.title}</MegaTitle>
            <Text>
              28. Februar 2019 — 20:00 Uhr
              <br />
              Backstage Werk
            </Text>
            <hr />
            <Text>
              <strong>Anonymously</strong> submitted
            </Text>
            <hr />
            <WrappingText>{event.description}</WrappingText>
          </Spacer>
        )
      }}
    </Query>
  )
}
