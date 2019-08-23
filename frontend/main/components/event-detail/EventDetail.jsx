import React from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import Link from "next/link"
import Head from "next/head"

import { DateTime } from "luxon"

import { ListAndDetailClose } from "@dk3/ui/layouts/ListAndDetail"
import { MegaTitle, Text, Hr } from "@dk3/ui/atoms/Typography"
import { Spinner } from "@dk3/ui/atoms/Spinner"
import { ErrorMessage } from "@dk3/ui/atoms/Message"
import { Spacer } from "@dk3/ui/atoms/Spacer"
import { Flex } from "@dk3/ui/atoms/Flex"
import { ButtonLink, VeryFancyLink } from "@dk3/ui/form/Button"
import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"
import { hasSkill } from "@dk3/shared-frontend/lib/hasSkill"
import { eventHref } from "@dk3/shared-frontend/lib/eventHref"
import styled from "@emotion/styled"

import { ApproveEventButton } from "../form/ApproveEventButton"
import RichText from "../../../../libs/rtxt/react"
import { BookmarkedBy } from "./BookmarkedBy"
import GoogleStructuredData from "./GoogleStructuredData"
import { CheckForApprovalButton } from "../form/CheckForApprovalButton"

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
    canceled
    postponed
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
  padding-bottom: 4rem;
`

export const EventDetail = ({ id, showMine }) => {
  return (
    <Query query={EVENT_DETAIL} variables={{ id }}>
      {({ loading, error, data }) => {
        if (error) return <ErrorMessage>Error loading event data</ErrorMessage>
        if (loading) return <Spinner pv="xxl">Loading</Spinner>
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

        const description = event.description
          ? event.description.substr(0, 120)
          : `${event.title} at ${event.location} on the ${fromDt.toFormat(
              "dd.MM.yyyy"
            )}`

        return (
          <Wrapper>
            <Head>
              <title>{event.title} on derkonzert</title>
              <meta name="description" content={description} />
              <meta property="og:description" content={description} />
              <meta
                property="og:image"
                content={`https://derkonzert.de/social-card${eventHref(
                  event,
                  "event-card"
                )}.png`}
              />
              <link
                rel="canonical"
                href={`https://derkonzert.de${eventHref(event)}`}
              />
            </Head>
            <MegaTitle data-event-title mr="xl" mb="m">
              {event.title}
            </MegaTitle>

            {(event.postponed || event.canceled) && (
              <ErrorMessage mv="s">
                {event.canceled
                  ? "This has been canceled."
                  : "The event has been postponed."}
              </ErrorMessage>
            )}

            <Link
              href={`/${showMine ? "?showMine=1" : ""}`}
              as={`/${showMine ? "mine" : ""}`}
              passHref
            >
              <ListAndDetailClose title="Close detail page" />
            </Link>
            {!event.approved && (
              <Spacer mb="s" style={{ color: "red" }}>
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
            <Hr />
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

              <Flex grow={0}>
                <CurrentUser>
                  {({ user }) => (
                    <React.Fragment>
                      {!event.approved && hasSkill(user, "APPROVE_EVENT") && (
                        <React.Fragment>
                          <CheckForApprovalButton ml="s" eventId={event.id}>
                            Check for Approval
                          </CheckForApprovalButton>
                          <ApproveEventButton ml="s" eventId={event.id}>
                            Approve
                          </ApproveEventButton>
                        </React.Fragment>
                      )}

                      {hasSkill(user, "UPDATE_EVENT") && (
                        <Link
                          href={`/?eventId=${event.id}&editMode=1`}
                          as={`/update-event/${event.id}`}
                          passHref
                        >
                          <ButtonLink ml="s">Edit</ButtonLink>
                        </Link>
                      )}
                    </React.Fragment>
                  )}
                </CurrentUser>
              </Flex>
            </Flex>
            <Hr />
            {event.description ? (
              <Spacer mv="s">
                <RichText value={event.description} />
              </Spacer>
            ) : (
              <Text>No further description available at the moment.</Text>
            )}
            {!!event.url && (
              <React.Fragment>
                <Hr />
                <Spacer mt="l">
                  <VeryFancyLink
                    ph="l"
                    pv="m"
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Find Tickets
                  </VeryFancyLink>
                </Spacer>
              </React.Fragment>
            )}
            <GoogleStructuredData
              name={event.title}
              description={`${event.title} on ${fromDt.toFormat(
                "dd. MMMM yyyy"
              )} at ${event.location} in Munich`}
              startDate={new Date(event.from)}
              endDate={new Date(event.to)}
              url={`https://derkonzert.de${eventHref(event)}`}
              locationName={event.location}
              locationAddress="Munich"
            />
          </Wrapper>
        )
      }}
    </Query>
  )
}
