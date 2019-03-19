import React from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"

import { DateTime } from "luxon"

import { MegaTitle, Text, WrappingText, Link } from "@dk3/ui/atoms/Typography"
import { Spinner } from "@dk3/ui/atoms/Spinner"
import { Spacer } from "@dk3/ui/atoms/Spacer"
import { ApproveEventButton } from "../form/ApproveEventButton"

export const EVENT_DETAIL_FRAGMENT = gql`
  fragment EventDetailEvent on Event {
    __typename
    id
    title
    approved
    description
    url
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
        if (loading) return <Spinner pv={6}>Loading</Spinner>

        const { event } = data
        const fromDt = DateTime.fromISO(event.from)
        const toDt = DateTime.fromISO(event.to)

        return (
          <Spacer pa={4}>
            <MegaTitle mb={3}>{event.title}</MegaTitle>
            {!event.approved && (
              <Spacer mb={2} style={{ color: "red" }}>
                Event has not yet been checked for validity
              </Spacer>
            )}
            <Text>
              {fromDt.toFormat("dd. MMMM yyyy")}
              {", "}
              {fromDt.toFormat("HH:mm")} &ndash; {toDt.toFormat("HH:mm")} Uhr
              <br />
              {event.location}
            </Text>
            <hr />
            <Text>
              <strong>Anonymously</strong> submitted
              <ApproveEventButton
                ml={2}
                eventId={event.id}
                approved={event.approved}
              >
                Approve
              </ApproveEventButton>
            </Text>
            <hr />
            <WrappingText>{event.description}</WrappingText>
            {!!event.url && <Link href={event.url}>Tickets</Link>}
          </Spacer>
        )
      }}
    </Query>
  )
}
