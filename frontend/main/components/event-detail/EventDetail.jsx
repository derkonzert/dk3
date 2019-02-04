import React from "react"

import { Query } from "react-apollo"
import gql from "graphql-tag"

import { Title } from "@dk3/ui/atoms/Typography"
import { Spinner } from "@dk3/ui/atoms/Spinner"
import { Box, FancyBox } from "@dk3/ui/atoms/Boxes"

export const EVENT_DETAIL_FRAGMENT = gql`
  fragment EventDetailEvent on Event {
    __typename
    id
    title
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
        const UseBox = event.fancyness > 0 ? FancyBox : Box

        return (
          <UseBox>
            <Title>{event.title}</Title>
          </UseBox>
        )
      }}
    </Query>
  )
}
