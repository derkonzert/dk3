import React from "react"
import Link from "next/link"
import { Mutation, Query } from "react-apollo"
import gql from "graphql-tag"
import { State } from "react-powerplug"

import { Spinner } from "@dk3/ui/atoms/Spinner"
import { FancyButton } from "@dk3/ui/form/Button"
import { TextInput } from "@dk3/ui/form/TextInput"
import { Checkbox } from "@dk3/ui/form/Checkbox"

import { Small, Link as UILink, SubTitle, Text } from "@dk3/ui/atoms/Typography"
import { ErrorMessage } from "@dk3/ui/atoms/Message"
import { currentUserQuery } from "@dk3/shared-frontend/lib/CurrentUser"
import { SuccessMessage } from "@dk3/ui/atoms/Message"

export const USER_DATA_FRAGMENT = gql`
  fragment UserData on User {
    id
    username
    sendEmails
    publicUsername
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
              showSuccess: false,
              username: data.me.username,
              usernameError: "",
              publicUsername: data.me.publicUsername,
              publicUsernameError: "",
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
                    const { username, publicUsername, sendEmails } = state

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
                          sendEmails,
                          publicUsername,
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
                      {state.showSuccess &&
                        state.username === data.me.username && (
                          <SuccessMessage mb={3}>
                            All changes have been saved
                          </SuccessMessage>
                        )}

                      <SubTitle mt={4}>Notifications:</SubTitle>

                      <Text mv={3}>
                        We would like to notify you, when new events arrive, one
                        of your bookmarked events changes, or gets canceled.
                      </Text>
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

                      <SubTitle mt={4}>Privacy:</SubTitle>
                      <Text mv={3}>
                        If you like, your username can be shown on the detail
                        page of an event that {"you've"} bookmarked.
                      </Text>
                      <Checkbox
                        checked={state.publicUsername}
                        error={state.publicUsernameError}
                        name="publicUsername"
                        onChange={e => {
                          const checked = e.target.checked

                          setState({ publicUsername: checked }, () => {
                            saveChanges({ ...state, publicUsername: checked })
                          })
                        }}
                        label="Show my username publically on events I bookmarked"
                      />
                      <SubTitle mt={4}>Your Account:</SubTitle>
                      <Text mv={3}>
                        Your email address currently can not be changed. If you
                        need to change it, please contact us via email.
                      </Text>
                      <TextInput
                        disabled
                        value={state.email}
                        name="email"
                        label="Email Address"
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
                        mb={4}
                        disabled={state.username === data.me.username}
                      >
                        Save new username
                      </FancyButton>

                      <Link href="/password" as="/account/password" passHref>
                        <UILink>
                          <Small>Change Password</Small>
                        </UILink>
                      </Link>
                    </form>
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
