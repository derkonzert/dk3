// title: String!
// from: Date!
// to: Date
import React from "react"
import { Mutation } from "react-apollo"
import gql from "graphql-tag"
import { State } from "react-powerplug"
import { DateTime } from "luxon"

import { FancyButton } from "@dk3/ui/form/Button"
import { TextInput } from "@dk3/ui/form/TextInput"
import { DateInput } from "@dk3/ui/form/DateInput"

import {
  UPCOMING_EVENTS,
  UPCOMING_EVENTS_EVENT_FRAGMENT,
} from "../list/EventList"
import { Title } from "@dk3/ui/atoms/Typography"
import { Spacer } from "@dk3/ui/atoms/Spacer"

export const CREATE_EVENT = gql`
  mutation createNewEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      ...UpcomingEventsEvent
    }
  }
  ${UPCOMING_EVENTS_EVENT_FRAGMENT}
`

export const CreateEventForm = ({ onCreated }) => {
  const now = Date.now()
  const to = new Date(now + 500)
  const from = new Date(now)

  return (
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

            onCreated && onCreated(createEvent)
          }}
        >
          {createEvent => {
            return (
              <Spacer pa={4}>
                <form
                  data-add-event-form
                  onSubmit={e => {
                    e.preventDefault()

                    const fromDt = DateTime.fromJSDate(state.from)
                      .startOf("day")
                      .set({
                        hour: 20,
                      })
                    const toDt = DateTime.fromJSDate(state.to)
                      .startOf("day")
                      .set({
                        hour: 22,
                      })

                    createEvent({
                      variables: {
                        input: {
                          ...state,
                          from: fromDt.toISO(),
                          to: toDt.toISO(),
                        },
                      },
                    })
                  }}
                >
                  <Title>Add Event</Title>
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
                  <DateInput
                    value={state.from}
                    name="from"
                    onChange={from => {
                      let to = state.to
                      if (from > to) {
                        to = new Date(from.getTime() + 500)
                      }
                      setState({ from, to })
                    }}
                    label="From"
                  />
                  <DateInput
                    value={state.to}
                    name="to"
                    onChange={to => setState({ to })}
                    label="To"
                  />
                  <FancyButton type="submit">Save new event</FancyButton>
                </form>
              </Spacer>
            )
          }}
        </Mutation>
      )}
    </State>
  )
}
