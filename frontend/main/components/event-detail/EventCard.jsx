import React from "react"
import { Query } from "react-apollo"
import { DateTime } from "luxon"
import gql from "graphql-tag"
import { Spinner } from "@dk3/ui/atoms/Spinner"
import { ErrorMessage } from "@dk3/ui/atoms/Message"
import styled from "@emotion/styled"
import { MegaTitle, Text } from "@dk3/ui/atoms/Typography"

export const EVENT_CARD_QUERY = gql`
  query eventCard($id: ID!) {
    event(id: $id) {
      id
      title
      from
      to
      location
    }
  }
`

const Wrapper = styled.main`
  display: grid;
  grid-template-rows: min-content min-content;
  justify-content: center;
  align-content: center;
  background-color: white;
  height: 100vh;
  width: 100vw;
  padding: 2rem 2rem 4rem;
`

const CardTitle = styled(MegaTitle)`
  font-size: 4.5rem;
`

const CardText = styled(Text)`
  font-size: 2rem;
  line-height: 1.4;
`

export const EventCard = ({ title, from, location }) => (
  <React.Fragment>
    <CardTitle mb={4}>{title}</CardTitle>
    <CardText>
      {DateTime.fromISO(from).toLocaleString({
        weekday: "long",
        month: "long",
        day: "2-digit",
      })}{" "}
      at {location}
    </CardText>
    <CardText>derkonzert.de</CardText>
  </React.Fragment>
)

export const EventCardQuery = ({ id }) => (
  <Wrapper>
    <Query query={EVENT_CARD_QUERY} variables={{ id }}>
      {({ loading, error, data }) => {
        if (loading) {
          return <Spinner />
        }

        if (error) {
          return <ErrorMessage>{error.message}</ErrorMessage>
        }

        if (!data.event) {
          return <ErrorMessage>Event doesnt exist</ErrorMessage>
        }

        return <EventCard {...data.event} />
      }}
    </Query>
  </Wrapper>
)
