import React, { useRef, useEffect } from "react"

import Link from "next/link"
import { withRouter } from "next/router"
import { Mutation, Query } from "react-apollo"
import gql from "graphql-tag"
import { State } from "react-powerplug"

import { eventHref } from "@dk3/shared-frontend/lib/eventHref"
import { Spinner } from "@dk3/ui/atoms/Spinner"
import { ButtonLink, FancyButton } from "@dk3/ui/form/Button"
import { TextInput } from "@dk3/ui/form/TextInput"
import { TextArea } from "@dk3/ui/form/TextArea"
import { Checkbox } from "@dk3/ui/form/Checkbox"
import { Spacer } from "@dk3/ui/atoms/Spacer"

import {
  Message,
  ErrorMessage,
  WarningMessage,
  SuccessMessage,
} from "@dk3/ui/atoms/Message"
import { EVENT_DETAIL_FRAGMENT } from "../event-detail/EventDetail"
import { DateTimeInput } from "@dk3/ui/form/DateTimeInput"
import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"
import { hasSkill } from "@dk3/shared-frontend/lib/hasSkill"
import { DeleteEventButton } from "./DeleteEventButton"
import { Flex } from "@dk3/ui/atoms/Flex"

export const EVENT_DATA = gql`
  query eventDetail($id: ID!) {
    event(id: $id) {
      ...EventDetailEvent
    }
  }
  ${EVENT_DETAIL_FRAGMENT}
`

export const UPDATE_EVENT = gql`
  mutation updateEvent($input: UpdateEventInput!) {
    updateEvent(input: $input) {
      ...EventDetailEvent
    }
  }
  ${EVENT_DETAIL_FRAGMENT}
`

function updateCache(cache, query, updateEvent) {
  const cachedData = cache.readQuery({
    query,
    variables: {
      id: updateEvent.id,
    },
  })

  if (cachedData) {
    cache.writeQuery({
      query,
      data: { event: { ...updateEvent } },
    })
  }
}

const FormStatus = ({ status, message }) => {
  const ref = useRef()

  useEffect(() => {
    if (
      ref.current &&
      (status === FormStatus.ERROR || status === FormStatus.SUCCESS)
    ) {
      ref.current.scrollIntoViewIfNeeded()
    }
  })

  return (
    <React.Fragment>
      {status === FormStatus.UNTOUCHED && (
        <Message ref={ref} mb={3}>
          All up to date.
        </Message>
      )}
      {status === FormStatus.TOUCHED && (
        <WarningMessage ref={ref} mb={3}>
          Unsaved changes.
        </WarningMessage>
      )}
      {status === FormStatus.SUCCESS && (
        <SuccessMessage ref={ref} mb={3}>
          All changes have been saved
        </SuccessMessage>
      )}
      {status === FormStatus.ERROR && (
        <ErrorMessage ref={ref} mb={3}>
          {message}
        </ErrorMessage>
      )}
      {status === FormStatus.SAVING && (
        <Message ref={ref} mb={3}>
          …saving changes.
        </Message>
      )}
    </React.Fragment>
  )
}

FormStatus.ERROR = "ERROR"
FormStatus.SUCCESS = "SUCCESS"
FormStatus.UNTOUCHED = "UNTOUCHED"
FormStatus.TOUCHED = "TOUCHED"
FormStatus.SAVING = "SAVING"

export const UpdateEventForm = withRouter(({ id }) => {
  return (
    <CurrentUser>
      {({ user }) =>
        id && hasSkill(user, "UPDATE_EVENT") ? (
          <Query query={EVENT_DATA} variables={{ id }}>
            {({ loading, error, data }) => {
              if (error) {
                return <div>{error.message}</div>
              }

              if (loading) {
                return <Spinner />
              }

              return (
                <State
                  initial={{
                    formStatus: FormStatus.UNTOUCHED,
                    formMessage: "", // custom message case of error
                    title: data.event.title || "",
                    titleError: "",
                    location: data.event.location || "",
                    locationError: "",
                    description: data.event.description || "",
                    descriptionError: "",
                    url: data.event.url || "",
                    urlError: "",
                    from: new Date(data.event.from),
                    fromError: "",
                    to: new Date(data.event.to),
                    toError: "",
                    approved: data.event.approved,
                    approvedError: "",
                    canceled: data.event.canceled,
                    canceledError: "",
                    postponed: data.event.postponed,
                    postponedError: "",
                  }}
                >
                  {({ state, setState }) => (
                    <Mutation
                      mutation={UPDATE_EVENT}
                      update={(cache, { data: { updateEvent } }) => {
                        updateCache(cache, EVENT_DATA, updateEvent)

                        setState({
                          formStatus: FormStatus.SUCCESS,
                        })
                      }}
                    >
                      {updateEvent => {
                        function saveChanges(state) {
                          const {
                            approved,
                            canceled,
                            postponed,
                            title,
                            location,
                            from,
                            to,
                            url,
                            description,
                          } = state

                          const formErrors = []

                          if (title.trim().length === 0) {
                            formErrors.push(["titleError", "Title is required"])
                          }

                          if (location.trim().length === 0) {
                            formErrors.push([
                              "locationError",
                              "Location is required",
                            ])
                          }

                          if (to - from < 0) {
                            formErrors.push([
                              "toError",
                              "End date should be after start date",
                            ])
                          }

                          if (formErrors.length) {
                            setState(
                              formErrors.reduce(
                                (errors, [field, errorMessage]) => {
                                  errors[field] = errorMessage
                                  return errors
                                },
                                {
                                  formStatus: FormStatus.ERROR,
                                  formMessage: "See errors below",
                                }
                              )
                            )

                            return
                          }

                          const allErrorsCleared = Object.keys(state).reduce(
                            (clearedErrors, key) => {
                              if (key.endsWith("Error")) {
                                clearedErrors[key] = ""
                              }
                              return clearedErrors
                            },
                            {}
                          )
                          setState({
                            formStatus: FormStatus.SAVING,
                            ...allErrorsCleared,
                          })

                          updateEvent({
                            variables: {
                              input: {
                                id,
                                title,
                                location,
                                from,
                                to,
                                url,
                                description,
                                approved,
                                canceled,
                                postponed,
                              },
                            },
                          })
                        }

                        return (
                          <Spacer pa={4}>
                            <form
                              data-add-event-form
                              onSubmit={e => {
                                e.preventDefault()

                                saveChanges(state)
                              }}
                            >
                              <FormStatus
                                status={state.formStatus}
                                message={state.formMessage}
                              />

                              <Checkbox
                                checked={state.approved}
                                error={state.approvedError}
                                name="approved"
                                onChange={e => {
                                  const checked = e.target.checked

                                  setState({ approved: checked }, () => {
                                    saveChanges({
                                      ...state,
                                      approved: checked,
                                    })
                                  })
                                }}
                                label="Approved Event"
                              />

                              <Checkbox
                                checked={state.canceled}
                                error={state.canceledError}
                                name="canceled"
                                onChange={e => {
                                  const checked = e.target.checked

                                  setState({ canceled: checked }, () => {
                                    saveChanges({
                                      ...state,
                                      canceled: checked,
                                    })
                                  })
                                }}
                                label="Canceled Event"
                              />

                              <Checkbox
                                checked={state.postponed}
                                error={state.postponedError}
                                name="postponed"
                                onChange={e => {
                                  const checked = e.target.checked

                                  setState({ postponed: checked }, () => {
                                    saveChanges({
                                      ...state,
                                      postponed: checked,
                                    })
                                  })
                                }}
                                label="Postponed Event"
                              />

                              <TextInput
                                value={state.title}
                                error={state.titleError}
                                onChange={e =>
                                  setState({
                                    formStatus: FormStatus.TOUCHED,
                                    title: e.target.value,
                                  })
                                }
                                name="title"
                                label="Event title"
                              />

                              <TextInput
                                value={state.location}
                                error={state.locationError}
                                onChange={e =>
                                  setState({
                                    formStatus: FormStatus.TOUCHED,
                                    location: e.target.value,
                                  })
                                }
                                name="location"
                                label="Event Location"
                              />

                              <DateTimeInput
                                value={state.from}
                                name="from"
                                dateError={state.fromError}
                                onChange={(event, from) => {
                                  setState({
                                    formStatus: FormStatus.TOUCHED,
                                    from,
                                  })
                                }}
                                dateLabel="Event Date"
                                timeLabel="Door time"
                              />

                              <DateTimeInput
                                value={state.to}
                                name="to"
                                dateError={state.toError}
                                onChange={(event, to) => {
                                  setState({
                                    formStatus: FormStatus.TOUCHED,
                                    to,
                                  })
                                }}
                                dateLabel="Event End Date"
                                timeLabel="Time"
                              />

                              <TextInput
                                value={state.url}
                                error={state.urlError}
                                onChange={e =>
                                  setState({
                                    formStatus: FormStatus.TOUCHED,
                                    url: e.target.value,
                                  })
                                }
                                type="url"
                                name="url"
                                label="Event Link"
                              />

                              <TextArea
                                value={state.description}
                                error={state.descriptionError}
                                onChange={e =>
                                  setState({
                                    formStatus: FormStatus.TOUCHED,
                                    description: e.target.value,
                                  })
                                }
                                name="description"
                                label="Description"
                                description={
                                  <a
                                    href={`http://open.spotify.com/search/results/${encodeURIComponent(
                                      state.title
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Find on Spotify
                                  </a>
                                }
                                rows={5}
                              />

                              <Flex mv={4} justifyContent="center">
                                <Flex grow={0}>
                                  <DeleteEventButton
                                    eventId={data.event.id}
                                    onClick={() => {
                                      window.location.href = "/"
                                    }}
                                  >
                                    Delete Event
                                  </DeleteEventButton>
                                </Flex>
                              </Flex>

                              <FancyButton type="submit" block pa={3} mb={3}>
                                Save changes
                              </FancyButton>

                              <Link
                                passHref
                                href={`/?eventId=${data.event.id}`}
                                as={eventHref(data.event)}
                              >
                                <ButtonLink mb={4} block>
                                  Back
                                </ButtonLink>
                              </Link>
                            </form>
                          </Spacer>
                        )
                      }}
                    </Mutation>
                  )}
                </State>
              )
            }}
          </Query>
        ) : (
          <ErrorMessage>
            {"You don't have sufficient authorization"}
          </ErrorMessage>
        )
      }
    </CurrentUser>
  )
})
