import React from "react"
import { Mutation } from "react-apollo"
import gql from "graphql-tag"
import { State } from "react-powerplug"
import { DateTime } from "luxon"

import { FancyButton } from "@dk3/ui/form/Button"
import { TextInput } from "@dk3/ui/form/TextInput"
import { Title } from "@dk3/ui/atoms/Typography"
import { Spacer } from "@dk3/ui/atoms/Spacer"

import {
  UPCOMING_EVENTS,
  UPCOMING_EVENTS_EVENT_FRAGMENT,
} from "../list/EventList"
import { DateTimeInput } from "@dk3/ui/form/DateTimeInput"
import { TextArea } from "@dk3/ui/form/TextArea"

export const CREATE_EVENT = gql`
  mutation createNewEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      ...UpcomingEventsEvent
    }
  }
  ${UPCOMING_EVENTS_EVENT_FRAGMENT}
`

export const CreateEventForm = ({ onCreated }) => {
  const today = DateTime.local().set({ hour: 20, minute: 0 })

  const to = today.plus({ hour: 3 }).toJSDate()
  const from = today.toJSDate()

  return (
    <State
      initial={{
        title: "",
        url: "",
        location: "",
        description: "",
        to,
        from,
        showEndDate: false,
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
                    const {
                      from,
                      to,
                      showEndDate: _showEndDate,
                      ...restState
                    } = state

                    const fromDt = DateTime.fromJSDate(from)

                    const toDt = DateTime.fromJSDate(to)

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
                  <DateTimeInput
                    value={state.from}
                    name="from"
                    onChange={(event, from) => {
                      let to = state.to

                      if (from > to) {
                        to = new Date(from.getTime() + 3 * 60 * 60 * 1000)
                      }

                      setState({ from, to })
                    }}
                    dateLabel="Event Date"
                    timeLabel="Door time"
                  />

                  {state.showEndDate ? (
                    <DateTimeInput
                      value={state.to}
                      name="to"
                      onChange={(event, to) => setState({ to })}
                      dateLabel="Event End Date"
                      timeLabel="Time"
                      mb={4}
                    />
                  ) : (
                    <Spacer mb={4}>
                      <label>
                        <input
                          type="checkbox"
                          onChange={() => setState({ showEndDate: true })}
                          checked={state.showEndDate}
                        />
                        {" It's a festival"}
                      </label>
                    </Spacer>
                  )}

                  <TextArea
                    mb={4}
                    value={state.description}
                    name="description"
                    onChange={e => setState({ description: e.target.value })}
                    label="Description"
                    rows={4}
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
