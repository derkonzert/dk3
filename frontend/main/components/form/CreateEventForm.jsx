import React from "react"
import { Query, Mutation } from "react-apollo"
import gql from "graphql-tag"
import { State } from "react-powerplug"
import { DateTime } from "luxon"
import Link from "next/link"
import styled from "@emotion/styled"

import { VeryFancyButton } from "@dk3/ui/form/Button"
import { TextInput, InputDescription } from "@dk3/ui/form/TextInput"
import { AutoComplete } from "@dk3/ui/form/AutoComplete"
import { Checkbox } from "@dk3/ui/form/Checkbox"
import { MegaTitle, Text } from "@dk3/ui/atoms/Typography"
import { ListAndDetailClose } from "@dk3/ui/layouts/ListAndDetail"
import { DateTimeInput } from "@dk3/ui/form/DateTimeInput"
import { TextArea } from "@dk3/ui/form/TextArea"
import { Flex } from "@dk3/ui/atoms/Flex"
import { Spinner } from "@dk3/ui/atoms/Spinner"
import { ErrorMessage } from "@dk3/ui/atoms/Message"

import { SentryErrorBoundary } from "../../lib/SentryErrorBoundary"

import {
  UPCOMING_EVENTS,
  UPCOMING_EVENTS_EVENT_FRAGMENT,
} from "../list/EventList"

export const CREATE_EVENT_USER_INFO = gql`
  query meHasAutobookmark {
    me {
      id
      autoBookmark
    }
  }
`

export const CREATE_EVENT = gql`
  mutation createNewEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      ...UpcomingEventsEvent
    }
  }
  ${UPCOMING_EVENTS_EVENT_FRAGMENT}
`

export const GET_LOCATION_OPTIONS = gql`
  query locationOptions($search: String!) {
    locations(search: $search) {
      name
    }
  }
`

const Wrapper = styled.div`
  position: relative;
`

const Form = styled.form`
  max-width: 52rem;
`

export const CreateEventForm = ({ onCreated }) => {
  const today = DateTime.local()
    .plus({ days: 1 })
    .set({ hour: 20, minute: 0 })

  const to = today.plus({ hour: 3 }).toJSDate()
  const from = today.toJSDate()

  return (
    <SentryErrorBoundary>
      <Query query={CREATE_EVENT_USER_INFO}>
        {({ client, loading, error, data }) => {
          if (loading) {
            return <Spinner />
          }

          if (error) {
            return <ErrorMessage>{error}</ErrorMessage>
          }

          return (
            <State
              initial={{
                isSaving: false,
                title: "",
                titleError: "",
                url: "",
                location: "",
                locationError: "",
                description: "",
                to,
                from,
                showEndDate: false,
                autoBookmark: data.me ? data.me.autoBookmark : false,
              }}
            >
              {({ state, setState, resetState }) => (
                <Mutation
                  mutation={CREATE_EVENT}
                  onError={err => {
                    setState({
                      isSaving: false,
                      formError: err.message,
                    })
                  }}
                  update={(cache, { data: { createEvent } }) => {
                    try {
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
                          upcomingEvents: {
                            ...upcomingEvents,
                            events: [
                              createEvent,
                              ...upcomingEvents.events,
                            ].sort((a, b) => {
                              return a.from > b.from ? 1 : -1
                            }),
                          },
                        },
                      })
                    } catch (_err) {
                      // form might have been used standalone
                    }

                    resetState()

                    onCreated && onCreated(createEvent)
                  }}
                >
                  {createEvent => {
                    return (
                      <Wrapper>
                        <Form
                          data-add-event-form
                          onSubmit={e => {
                            e.preventDefault()
                            const {
                              title,
                              url,
                              location,
                              description,
                              to,
                              from,
                              autoBookmark,
                            } = state

                            const fromDt = DateTime.fromJSDate(from)
                            const toDt = DateTime.fromJSDate(to)

                            const formErrors = []

                            if (!title.trim()) {
                              formErrors.push([
                                "titleError",
                                "The event title is required",
                              ])
                            }

                            if (!location.trim()) {
                              formErrors.push([
                                "locationError",
                                "The event's location is required",
                              ])
                            }

                            if (fromDt.diffNow("days") <= -0.5) {
                              formErrors.push([
                                "fromError",
                                "The event is in the past?",
                              ])
                            }

                            setState(
                              formErrors.reduce(
                                (errors, [field, errorMessage]) => {
                                  errors[field] = errorMessage
                                  return errors
                                },
                                {
                                  titleError: "",
                                  fromError: "",
                                  locationError: "",
                                }
                              )
                            )

                            if (formErrors.length) {
                              return
                            }

                            setState({
                              isSaving: true,
                            })

                            createEvent({
                              variables: {
                                input: {
                                  title,
                                  url,
                                  location,
                                  description,
                                  autoBookmark,
                                  from: fromDt.toISO(),
                                  to: toDt.toISO(),
                                },
                              },
                            })
                          }}
                        >
                          <MegaTitle mr="xl" mb="m">
                            Add New Event
                          </MegaTitle>
                          <Text mb="l">
                            {
                              "Add a concert to the list, so that others don't miss it."
                            }
                          </Text>

                          <Link href="/" passHref>
                            <ListAndDetailClose title="Back to event list" />
                          </Link>

                          {!!state.formError && (
                            <ErrorMessage mv="m">
                              {state.formError}
                            </ErrorMessage>
                          )}

                          <TextInput
                            value={state.title}
                            name="title"
                            error={state.titleError}
                            onChange={e => setState({ title: e.target.value })}
                            label="Title"
                            disabled={state.isSaving}
                            autoComplete="off"
                          />

                          <AutoComplete
                            mb="m"
                            name="location"
                            value={{
                              name: state.location,
                              label: state.location,
                            }}
                            error={state.locationError}
                            onChange={option => {
                              const location = option ? option.value : ""
                              setState({ location })
                            }}
                            label="Location"
                            disabled={state.isSaving}
                            loadOptions={async inputValue => {
                              const { data } = await client.query({
                                query: GET_LOCATION_OPTIONS,
                                variables: { search: inputValue },
                              })

                              return data.locations.map(({ name }) => ({
                                label: name,
                                value: name,
                              }))
                            }}
                          />

                          <DateTimeInput
                            value={state.from}
                            name="from"
                            dateError={state.fromError}
                            onChange={(_event, from) => {
                              let to = state.to

                              if (from > to) {
                                to = new Date(
                                  from.getTime() + 3 * 60 * 60 * 1000
                                )
                              }

                              setState({ from, to })
                            }}
                            dateLabel="Event Date"
                            timeLabel="Door time"
                            mb="s"
                            disabled={state.isSaving}
                          />

                          <Checkbox
                            mt="none"
                            mb="s"
                            label="It's a festival or it lasts more than one day"
                            type="checkbox"
                            onChange={() =>
                              setState({ showEndDate: !state.showEndDate })
                            }
                            checked={state.showEndDate}
                            disabled={state.isSaving}
                          />

                          {state.showEndDate && (
                            <DateTimeInput
                              value={state.to}
                              name="to"
                              onChange={(event, to) => setState({ to })}
                              dateLabel="Event End Date"
                              timeLabel="Time"
                              mb="m"
                              disabled={state.isSaving}
                            />
                          )}

                          <TextArea
                            mt="l"
                            mb="xs"
                            value={state.description}
                            name="description"
                            description="optional"
                            onChange={e =>
                              setState({ description: e.target.value })
                            }
                            label="Description"
                            rows={4}
                            disabled={state.isSaving}
                          />
                          <InputDescription mb="m">
                            Youtube, Vimeo and Spotify links will be embedded
                            automatically
                          </InputDescription>

                          <TextInput
                            mb="xs"
                            value={state.url}
                            name="url"
                            description="optional"
                            onChange={e => setState({ url: e.target.value })}
                            label="Tickets URL"
                            disabled={state.isSaving}
                            autoComplete="off"
                          />
                          <InputDescription mb="m">
                            This can speed-up the verification of your event
                          </InputDescription>

                          <Text mv="l">
                            {`After the new event is saved, it will be visible to
                      all visitors immediately, and another user will double-check everything later,
                      to make sure all information is correct.`}
                          </Text>

                          <Flex
                            mb="xxl"
                            alignItems="center"
                            justifyContent="flex-start"
                            wrap="wrap"
                          >
                            <Flex grow={0}>
                              <VeryFancyButton
                                ph="l"
                                pv="m"
                                mr="l"
                                type="submit"
                                style={{ whiteSpace: "nowrap" }}
                                disabled={state.isSaving}
                              >
                                Save New Event
                              </VeryFancyButton>
                            </Flex>
                            {!!data.me && (
                              <Checkbox
                                mv="s"
                                label={"Auto-Bookmark this event"}
                                type="checkbox"
                                onChange={() =>
                                  setState({
                                    autoBookmark: !state.autoBookmark,
                                  })
                                }
                                checked={state.autoBookmark}
                                disabled={state.isSaving}
                              />
                            )}
                          </Flex>
                        </Form>
                      </Wrapper>
                    )
                  }}
                </Mutation>
              )}
            </State>
          )
        }}
      </Query>
    </SentryErrorBoundary>
  )
}
