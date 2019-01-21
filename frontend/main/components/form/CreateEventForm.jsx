// title: String!
// from: Date!
// to: Date
import React from "react"
import { Mutation } from "react-apollo"
import gql from "graphql-tag"
import { State } from "react-powerplug"

import { Button } from "@dk3/ui/form/Button"

import {
  UPCOMING_EVENTS,
  UPCOMING_EVENTS_EVENT_FRAGMENT,
} from "../list/EventList"
import { TextInput } from "@dk3/ui/form/TextInput"
import { Box } from "@dk3/ui/atoms/Boxes"

export const CREATE_EVENT = gql`
  mutation createNewEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      ...UpcomingEventsEvent
    }
  }
  ${UPCOMING_EVENTS_EVENT_FRAGMENT}
`

export const CreateEventForm = () => {
  const now = Date.now()
  const to = new Date(now + 500).toISOString()
  const from = new Date(now).toISOString()

  return (
    <Box pa={4} mh={4}>
      <State initial={{ title: "", location: "", to, from }}>
        {({ state, setState, resetState }) => (
          <Mutation
            mutation={CREATE_EVENT}
            update={(cache, { data: { createEvent } }) => {
              const { upcomingEvents } = cache.readQuery({
                query: UPCOMING_EVENTS,
                variables: {
                  filter: "all",
                },
              })

              cache.writeQuery({
                query: UPCOMING_EVENTS,
                variables: { filter: "all" },
                data: {
                  upcomingEvents: [createEvent, ...upcomingEvents].sort(
                    (a, b) => {
                      return a.from > b.from ? 1 : -1
                    }
                  ),
                },
              })

              resetState()
            }}
          >
            {createEvent => {
              return (
                <form
                  onSubmit={e => {
                    e.preventDefault()

                    createEvent({
                      variables: {
                        input: state,
                      },
                    })
                  }}
                >
                  <TextInput
                    value={state.title}
                    name="title"
                    onChange={e => setState({ title: e.target.value })}
                    label="Title"
                  />
                  <TextInput
                    mb={4}
                    value={state.location}
                    name="location"
                    onChange={e => setState({ location: e.target.value })}
                    label="Location"
                  />
                  <TextInput
                    value={state.from}
                    name="from"
                    onChange={e => setState({ from: e.target.value })}
                    label="From"
                  />
                  <TextInput
                    value={state.to}
                    name="to"
                    onChange={e => setState({ to: e.target.value })}
                    label="To"
                  />
                  <Button type="submit">Save new event</Button>
                </form>
              )
            }}
          </Mutation>
        )}
      </State>
    </Box>
  )
}
