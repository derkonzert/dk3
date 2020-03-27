import React from "react"

import { Mutation, Query } from "react-apollo"
import gql from "graphql-tag"
import { State } from "react-powerplug"

import { Spinner } from "@dk3/ui/atoms/Spinner"
import { ErrorMessage } from "@dk3/ui/atoms/Message"
import { TextArea } from "@dk3/ui/form/TextArea"
import { Button, VeryFancyLink } from "@dk3/ui/form/Button"
import { Hr, Text, ListTitle, SubTitle, Small } from "@dk3/ui/atoms/Typography"

import { SentryErrorBoundary } from "../../../lib/SentryErrorBoundary"
import { PageWrapper } from "../../../components/PageWrapper"

export const USER_DATA_FRAGMENT = gql`
  fragment UserCalendarData on User {
    id
    calendarToken
  }
`

export const USER_DATA = gql`
  query {
    me {
      ...UserCalendarData
    }
  }
  ${USER_DATA_FRAGMENT}
`

export const UPDATE_CALENDAR_TOKEN = gql`
  mutation updateCalendarToken($input: UpdateCalendarTokenInput!) {
    updateCalendarToken(input: $input) {
      ...UserCalendarData
    }
  }
  ${USER_DATA_FRAGMENT}
`

export default function UpdateCalendarSettingForm() {
  return (
    <SentryErrorBoundary>
      <PageWrapper>
        <ListTitle mb="s">Calendar Integration</ListTitle>
        <Text mv="m">
          {
            "With this integration, you can have all events that you've bookmarked here, synced into your calendar."
          }
        </Text>
        <Hr mv="l" />
        <Query query={USER_DATA}>
          {({ loading, error, data }) => {
            if (error) {
              return <ErrorMessage>{error.message}</ErrorMessage>
            }

            if (loading) {
              return <Spinner />
            }

            if (!data.me) {
              return <ErrorMessage>{"You're not logged in"}</ErrorMessage>
            }

            return (
              <State
                initial={{
                  enableCalendar: !!data.me.calendarToken,
                }}
              >
                {({ state, setState }) => (
                  <Mutation mutation={UPDATE_CALENDAR_TOKEN}>
                    {updateCalendarToken => {
                      function saveChanges(state) {
                        const { enableCalendar } = state

                        /* TODO: dont allow just any username */

                        const formErrors = []

                        if (formErrors.length) {
                          setState(
                            formErrors.reduce(
                              (errors, [field, errorMessage]) => {
                                errors[field] = errorMessage
                                return errors
                              },
                              {}
                            )
                          )

                          return
                        }

                        updateCalendarToken({
                          variables: {
                            input: {
                              id: data.me.id,
                              enableCalendar: enableCalendar,
                            },
                          },
                        })
                      }
                      return (
                        <form
                          data-add-event-form
                          onSubmit={e => {
                            e.preventDefault()

                            saveChanges(state)
                          }}
                        >
                          {data.me.calendarToken ? (
                            <React.Fragment>
                              <SubTitle>Setup</SubTitle>
                              <Text mv="m">
                                Try clicking the following button, to integrate
                                the derkonzert calendar subscription with your
                                calendar setup
                              </Text>
                              <VeryFancyLink
                                href={`webcal://derkonzert.de/webcal/${data.me.calendarToken}.ics`}
                              >
                                Integrate Into Calendar App
                              </VeryFancyLink>

                              <Text mv="m">
                                Or copy the following url and use your calendars
                                add subscription feature:
                              </Text>

                              <TextArea
                                mb="none"
                                readOnly
                                rows={5}
                                value={`webcal://derkonzert.de/webcal/${data.me.calendarToken}.ics`}
                                onFocus={e => {
                                  try {
                                    e.target.setSelectionRange(
                                      0,
                                      e.target.value.length
                                    )
                                  } catch (err) {
                                    // Fail silently
                                  }
                                }}
                              />

                              <Text mb="m">
                                <Small>
                                  {
                                    "This is your personal URL, don't give it to anyone."
                                  }
                                </Small>
                              </Text>

                              <SubTitle mt="xl">Disable Integration</SubTitle>
                              <Text mv="m">
                                Note that you will have to setup your calendar
                                completely new, if it was disabled for once
                              </Text>
                              <Button
                                onClick={() => {
                                  setState({ enableCalendar: false }, () => {
                                    saveChanges({
                                      ...state,
                                      enableCalendar: false,
                                    })
                                  })
                                }}
                              >
                                Turn off
                              </Button>
                            </React.Fragment>
                          ) : (
                            <Button
                              onClick={() => {
                                setState({ enableCalendar: true }, () => {
                                  saveChanges({
                                    ...state,
                                    enableCalendar: true,
                                  })
                                })
                              }}
                            >
                              Enable calendar integration
                            </Button>
                          )}
                        </form>
                      )
                    }}
                  </Mutation>
                )}
              </State>
            )
          }}
        </Query>
      </PageWrapper>
    </SentryErrorBoundary>
  )
}
