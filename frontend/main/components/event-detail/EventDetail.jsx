import React from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import Link from "next/link"

import { DateTime } from "luxon"

import { ListAndDetailClose } from "@dk3/ui/layouts/ListAndDetail"
import { MegaTitle, Text } from "@dk3/ui/atoms/Typography"
import { Spinner } from "@dk3/ui/atoms/Spinner"
import { ErrorMessage } from "@dk3/ui/atoms/Message"
import { Spacer } from "@dk3/ui/atoms/Spacer"
import { Flex } from "@dk3/ui/atoms/Flex"
import { ButtonLink, VeryFancyLink } from "@dk3/ui/form/Button"
import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"
import { hasSkill } from "@dk3/shared-frontend/lib/hasSkill"
import styled from "@emotion/styled"

import { ApproveEventButton } from "../form/ApproveEventButton"
import RichText from "../../../../libs/rtxt/react"
import { BookmarkedBy } from "./BookmarkedBy"

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
    author {
      id
      username
    }
    bookmarkedBy {
      id
      username
    }
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

const Wrapper = styled.div`
  position: relative;
`

export const EventDetail = ({ id }) => {
  return (
    <Query query={EVENT_DETAIL} variables={{ id }}>
      {({ loading, error, data }) => {
        if (error) return <ErrorMessage>Error loading event data</ErrorMessage>
        if (loading) return <Spinner pv={6}>Loading</Spinner>
        const { event } = data

        if (!event) {
          return <MegaTitle>404 Event not found</MegaTitle>
        }

        const fromDt = DateTime.fromISO(event.from, {
          zone: "Europe/Berlin",
        })
        const toDt = DateTime.fromISO(event.to, { zone: "Europe/Berlin" })

        const hoursDiff = toDt.diff(fromDt, "hours").toObject()
        let daysDiff

        const isSingleDayEvent = hoursDiff.hours < 12

        if (!isSingleDayEvent) {
          daysDiff = toDt
            .endOf("day")
            .diff(fromDt.startOf("day"), "days")
            .toObject()
        }

        return (
          <Wrapper>
            <MegaTitle mr={5} mb={3}>
              {event.title}
            </MegaTitle>

            <Link href="/" passHref>
              <ListAndDetailClose title="Close detail page" />
            </Link>
            {!event.approved && (
              <Spacer mb={2} style={{ color: "red" }}>
                Event has not yet been checked for validity
              </Spacer>
            )}
            <Text>
              {isSingleDayEvent ? (
                <React.Fragment>
                  {fromDt.toFormat("dd. MMMM yyyy")}
                  {", "}
                  {fromDt.toFormat("HH:mm")} &ndash; {toDt.toFormat("HH:mm")}
                  <br />
                  at {event.location}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {fromDt.toFormat("dd. MMMM yyyy")}, {fromDt.toFormat("HH:mm")}
                  {" – "}
                  {toDt.toFormat("dd. MMMM")}, {toDt.toFormat("HH:mm")}
                  <br />
                  {`${Math.round(daysDiff.days)} days event at `}
                  {event.location}
                </React.Fragment>
              )}
            </Text>
            <hr />
            <Flex justifyContent="space-between" alignItems="center">
              <Text>
                {event.author && event.author.username ? (
                  <React.Fragment>
                    Submitted by <strong>{event.author.username}</strong>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <strong>Anonymously</strong> submitted
                  </React.Fragment>
                )}
                {!!event.bookmarkedBy.length && (
                  <BookmarkedBy
                    author={event.author}
                    users={event.bookmarkedBy}
                  />
                )}
              </Text>

              <div>
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
              </div>
            </Flex>
            <hr />
            {event.description ? (
              <Spacer mv={2}>
                <RichText value={event.description} />
              </Spacer>
            ) : (
              <Text>No further description available at the moment.</Text>
            )}
            {!!event.url && (
              <Spacer mt={4}>
                <VeryFancyLink
                  ph={4}
                  pv={3}
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy Tickets
                </VeryFancyLink>
              </Spacer>
            )}
          </Wrapper>
        )
      }}
    </Query>
  )
}
