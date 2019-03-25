import React from "react"
import { Mutation } from "react-apollo"
import gql from "graphql-tag"
import { State } from "react-powerplug"
import { DateTime } from "luxon"

import { FancyButton } from "@dk3/ui/form/Button"
import { TextInput } from "@dk3/ui/form/TextInput"
import { DateInput } from "@dk3/ui/form/DateInput"
import { Title } from "@dk3/ui/atoms/Typography"
import { Spacer } from "@dk3/ui/atoms/Spacer"

import {
  UPCOMING_EVENTS,
  UPCOMING_EVENTS_EVENT_FRAGMENT,
} from "../list/EventList"

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
    <State
      initial={{
        title: "",
        url: "",
        location: "",
        to,
        from,
        to_time: "22:00",
        from_time: "20:00",
      }}
    >
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
                    const { from, to, from_time, to_time, ...restState } = state
                    const fromTime = from_time.split(":")
                    const toTime = to_time.split(":")

                    const fromDt = DateTime.fromJSDate(from)
                      .startOf("day")
                      .set({
                        hour: fromTime[0],
                        minutes: fromTime[1],
                      })
                    const toDt = DateTime.fromJSDate(to)
                      .startOf("day")
                      .set({
                        hour: toTime[0],
                        minutes: toTime[1],
                      })

                    createEvent({
                      variables: {
                        input: {
                          ...restState,
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
                    value={state.url}
                    name="url"
                    onChange={e => setState({ url: e.target.value })}
                    label="Tickets URL"
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
                    label="From Date"
                  />
                  <TextInput
                    mb={4}
                    value={state.from_time}
                    name="from_time"
                    onChange={e => setState({ from_time: e.target.value })}
                    label="From Time"
                  />

                  <DateInput
                    value={state.to}
                    name="to"
                    onChange={to => setState({ to })}
                    label="To"
                  />
                  <TextInput
                    mb={4}
                    value={state.to_time}
                    name="to_time"
                    onChange={e => setState({ to_time: e.target.value })}
                    label="To Time"
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
