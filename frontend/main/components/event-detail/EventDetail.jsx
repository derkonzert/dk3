import React from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import Link from "next/link"

import { DateTime } from "luxon"

import { MegaTitle, Text, Link as UiLink } from "@dk3/ui/atoms/Typography"
import { Spinner } from "@dk3/ui/atoms/Spinner"
import { Spacer } from "@dk3/ui/atoms/Spacer"
import { ButtonLink } from "@dk3/ui/form/Button"
import { ApproveEventButton } from "../form/ApproveEventButton"
import RichText from "../../../../libs/rtxt/react"
import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"
import { hasSkill } from "@dk3/shared-frontend/lib/hasSkill"
import styled from "@emotion/styled"

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

const EventDetailClose = styled.a`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 5rem;
  line-height: 1.2;
  width: 4rem;
  text-align: center;
  text-decoration: none;
  font-family: "IBM Plex Serif";
  color: ${({ theme }) => theme.colors.text};
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
          <Spacer ma={4} style={{ position: "relative" }}>
            <MegaTitle mr={5} mb={3}>
              {event.title}
            </MegaTitle>

            <Link href="/" passHref>
              <EventDetailClose title="Close detail page">
                &times;
              </EventDetailClose>
            </Link>
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
              <CurrentUser>
                {({ user }) => (
                  <React.Fragment>
                    {hasSkill(user, "APPROVE_EVENT") && (
                      <ApproveEventButton
                        ml={2}
                        eventId={event.id}
                        approved={event.approved}
                      >
                        Approve
                      </ApproveEventButton>
                    )}

                    {hasSkill(user, "UPDATE_EVENT") && (
                      <Link
                        href={`/update-event?eventId=${event.id}`}
                        as={`/update-event/${event.id}`}
                        passHref
                      >
                        <ButtonLink ml={2}>Edit</ButtonLink>
                      </Link>
                    )}
                  </React.Fragment>
                )}
              </CurrentUser>
            </Text>
            <hr />
            {!!event.description && (
              <Spacer mv={2}>
                <RichText value={event.description} />
              </Spacer>
            )}
            {!!event.url && <UiLink href={event.url}>Tickets</UiLink>}
          </Spacer>
        )
      }}
    </Query>
  )
}
