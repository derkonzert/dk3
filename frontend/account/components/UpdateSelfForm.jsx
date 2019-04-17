import React from "react"
import Link from "next/link"
import { Mutation, Query } from "react-apollo"
import gql from "graphql-tag"
import { State } from "react-powerplug"

import { Spinner } from "@dk3/ui/atoms/Spinner"
import { FancyButton } from "@dk3/ui/form/Button"
import { TextInput, InputLabel } from "@dk3/ui/form/TextInput"
import { Checkbox } from "@dk3/ui/form/Checkbox"
import { Spacer } from "@dk3/ui/atoms/Spacer"
import { Small, Link as UILink } from "@dk3/ui/atoms/Typography"
import { currentUserQuery } from "@dk3/shared-frontend/lib/CurrentUser"
import { Message } from "@dk3/ui/atoms/Message"

export const USER_DATA_FRAGMENT = gql`
  fragment UserData on User {
    id
    username
    sendEmails
    email
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

export const UPDATE_SELF = gql`
  mutation updateSelf($input: UpdateSelfInput!) {
    updateSelf(input: $input) {
      ...UserData
    }
  }
  ${USER_DATA_FRAGMENT}
`

function updateCache(cache, query, newMe) {
  const cachedData = cache.readQuery({
    query,
  })

  if (cachedData) {
    const { me } = cachedData

    cache.writeQuery({
      query,
      data: { me: { ...me, username: newMe.username } },
    })
  }
}

export const UpdateSelfForm = ({ onCreated }) => {
  return (
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
              username: data.me.username,
              usernameError: "",
              sendEmails: data.me.sendEmails,
              sendEmailsError: "",
              email: data.me.email,
            }}
          >
            {({ state, setState }) => (
              <Mutation
                mutation={UPDATE_SELF}
                update={(cache, { data: { updateSelf } }) => {
                  updateCache(cache, USER_DATA, updateSelf)
                  updateCache(cache, currentUserQuery, updateSelf)

                  onCreated && onCreated(updateSelf)

                  setState({
                    showSuccess: true,
                  })
                }}
              >
                {updateSelf => {
                  function saveChanges(state) {
                    const { username, sendEmails } = state

                    /* TODO: dont allow just any username */

                    const formErrors = []

                    if (username.trim().length < 2) {
                      formErrors.push([
                        "usernameError",
                        "The username should at least have 2 characters",
                      ])
                    }

                    if (formErrors.length) {
                      setState(
                        formErrors.reduce((errors, [field, errorMessage]) => {
                          errors[field] = errorMessage
                          return errors
                        }, {})
                      )

                      return
                    }

                    updateSelf({
                      variables: {
                        input: {
                          id: data.me.id,
                          username: username.trim(),
                          sendEmails: sendEmails,
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

                        <TextInput
                          disabled
                          value={state.email}
                          name="email"
                          label="Email Address"
                        />
                        <InputLabel>Notification Settings:</InputLabel>
                        <Checkbox
                          checked={state.sendEmails}
                          error={state.sendEmailsError}
                          name="sendEmails"
                          onChange={e => {
                            const checked = e.target.checked

                            setState({ sendEmails: checked }, () => {
                              saveChanges({ ...state, sendEmails: checked })
                            })
                          }}
                          label="Send me emails to inform me about events and updates"
                        />

                        <TextInput
                          value={state.username.trim()}
                          error={state.usernameError}
                          name="username"
                          onChange={e => setState({ username: e.target.value })}
                          label="Username"
                        />

                        <FancyButton
                          type="submit"
                          block
                          mb={5}
                          disabled={state.username === data.me.username}
                        >
                          Save new username
                        </FancyButton>

                        <Link href="/account/calendar" passHref>
                          <UILink>
                            <Small>Calendar Integration Setup</Small>
                          </UILink>
                        </Link>
                        <br />
                        <Link href="/account/password" passHref>
                          <UILink>
                            <Small>Change Password</Small>
                          </UILink>
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
  )
}
