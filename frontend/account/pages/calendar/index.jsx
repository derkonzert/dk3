import React from "react"

import { Mutation, Query } from "react-apollo"
import gql from "graphql-tag"
import { State } from "react-powerplug"

import { Spinner } from "@dk3/ui/atoms/Spinner"

import { Spacer } from "@dk3/ui/atoms/Spacer"

import { Message } from "@dk3/ui/atoms/Message"
import { TextArea } from "@dk3/ui/form/TextArea"
import { Button, VeryFancyLink } from "@dk3/ui/form/Button"
import { Text, ListTitle, SubTitle, Small } from "@dk3/ui/atoms/Typography"

export const USER_DATA_FRAGMENT = gql`
  fragment UserData on User {
    id
    calendarToken
  }
`

export const USER_DATA = gql`
  query {
    me {
      ...UserData
    }
  }
  ${USER_DATA_FRAGMENT}
`

export const UPDATE_CALENDAR_TOKEN = gql`
  mutation updateCalendarToken($input: UpdateCalendarTokenInput!) {
    updateCalendarToken(input: $input) {
      ...UserData
    }
  }
  ${USER_DATA_FRAGMENT}
`

export default function UpdateCalendarSettingForm() {
  return (
    <React.Fragment>
      <ListTitle mb={2}>Calendar Integration</ListTitle>
      <Text>
        {
          "With this integration, you can have all events that you've bookmarked here, synced into your calendar."
        }
      </Text>
      <Query query={USER_DATA}>
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
                showSuccess: false,
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
                          formErrors.reduce((errors, [field, errorMessage]) => {
                            errors[field] = errorMessage
                            return errors
                          }, {})
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
                      <Spacer pa={4}>
                        <form
                          data-add-event-form
                          onSubmit={e => {
                            e.preventDefault()

                            saveChanges(state)
                          }}
                        >
                          {state.showSuccess &&
                            state.username === data.me.username && (
                              <Message mb={3}>
                                All changes have been saved
                              </Message>
                            )}

                          {data.me.calendarToken ? (
                            <React.Fragment>
                              <SubTitle>Setup</SubTitle>
                              <Text mv={3}>
                                Try clicking the following button, to integrate
                                the derkonzert calendar subscription with your
                                calendar setup
                              </Text>
                              <VeryFancyLink
                                href={`webcal://stage.dk3.tech/webcal/${
                                  data.me.calendarToken
                                }.ics`}
                              >
                                Integrate Into Calendar App
                              </VeryFancyLink>

                              <Text mv={3}>
                                Or copy the following url and use your calendars
                                add subscription feature:
                              </Text>

                              <TextArea
                                mb={0}
                                readOnly
                                rows={5}
                                value={`webcal://stage.dk3.tech/webcal/${
                                  data.me.calendarToken
                                }.ics`}
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

                              <Text mb={3}>
                                <Small>
                                  {
                                    "This is your personal URL, don't give it to anyone."
                                  }
                                </Small>
                              </Text>

                              <SubTitle mt={5}>Disable Integration</SubTitle>
                              <Text mv={3}>
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
                      </Spacer>
                    )
                  }}
                </Mutation>
              )}
            </State>
          )
        }}
      </Query>
    </React.Fragment>
  )
}
