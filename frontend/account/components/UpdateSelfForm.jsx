import React, { useState } from "react"
import Link from "next/link"
import { Mutation, Query } from "react-apollo"
import gql from "graphql-tag"

import { Spinner } from "@dk3/ui/atoms/Spinner"
import { FancyButton } from "@dk3/ui/form/Button"
import { TextInput } from "@dk3/ui/form/TextInput"
import { Checkbox } from "@dk3/ui/form/Checkbox"

import { Small, Link as UILink, SubTitle, Text } from "@dk3/ui/atoms/Typography"
import { ErrorMessage } from "@dk3/ui/atoms/Message"
import { currentUserQuery } from "@dk3/shared-frontend/lib/CurrentUser"
import { SuccessMessage } from "@dk3/ui/atoms/Message"
import { useUniquenessCheck } from "../../shared/lib/useUniquenessCheck"

export const USER_DATA_FRAGMENT = gql`
  fragment UserData on User {
    id
    username
    sendEmails
    publicUsername
    autoBookmark
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

const uriBase =
  process.env.NODE_ENV === "production" ? "/" : "http://localhost:8004/"

const Form = ({ data, onCreated }) => {
  const [showSuccess, setShowSuccess] = useState(false)
  const [formState, setFormState] = useState({
    username: data.me.username,
    publicUsername: data.me.publicUsername,
    autoBookmark: data.me.autoBookmark,
    sendEmails: data.me.sendEmails,
    email: data.me.email,
  })
  const [formErrors, setFormErrors] = useState({
    username: "",
  })
  const [usernameIsUnique, usernameIsChecking] = useUniquenessCheck(
    formState.username,
    `${uriBase}auth/unique-username`
  )

  return (
    <Mutation
      mutation={UPDATE_SELF}
      update={(cache, { data: { updateSelf } }) => {
        updateCache(cache, USER_DATA, updateSelf)
        updateCache(cache, currentUserQuery, updateSelf)

        onCreated && onCreated(updateSelf)

        setShowSuccess(true)
      }}
    >
      {updateSelf => {
        function saveChanges(state) {
          const { username, publicUsername, autoBookmark, sendEmails } = state

          /* TODO: dont allow just any username */

          const formErrors = []

          if (username.trim().length < 2) {
            formErrors.push([
              "username",
              "The username should at least have 2 characters",
            ])
          }

          if (formErrors.length) {
            setFormErrors(
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
                autoBookmark,
                sendEmails,
                publicUsername,
              },
            },
          })
        }
        return (
          <form
            style={{ textAlign: "left" }}
            data-add-event-form
            onSubmit={e => {
              e.preventDefault()

              saveChanges({ ...formState })
            }}
          >
            {showSuccess && formState.username === data.me.username && (
              <SuccessMessage mb={3}>
                All changes have been saved
              </SuccessMessage>
            )}

            <SubTitle mt={4}>Notifications:</SubTitle>

            <Text mv={3}>
              We would like to notify you, when new events arrive, one of your
              bookmarked events changes, or gets canceled.
            </Text>
            <Checkbox
              checked={formState.sendEmails}
              error={formErrors.sendEmails}
              name="sendEmails"
              onChange={e => {
                const checked = e.target.checked

                setFormState({ ...formState, sendEmails: checked }, () => {
                  saveChanges({ ...formState, sendEmails: checked })
                })
              }}
              label="Send me emails to inform me about events and updates"
            />

            <SubTitle mt={4}>Privacy:</SubTitle>
            <Text mv={3}>
              If you like, your username can be shown on the detail page of an
              event that {"you've"} added or bookmarked.
            </Text>
            <Checkbox
              checked={formState.publicUsername}
              error={formErrors.publicUsername}
              name="publicUsername"
              onChange={e => {
                const checked = e.target.checked

                setFormState({ ...formState, publicUsername: checked }, () => {
                  saveChanges({ ...formState, publicUsername: checked })
                })
              }}
              label="Show my username publically on events I added or bookmarked"
            />

            <SubTitle mt={4}>Convenience:</SubTitle>

            <Text mv={3}>
              Bookmark events that you add yourself by default.
            </Text>
            <Checkbox
              checked={formState.autoBookmark}
              name="autoBookmark"
              onChange={e => {
                const checked = e.target.checked

                setFormState({ ...formState, autoBookmark: checked }, () => {
                  saveChanges({ ...formState, autoBookmark: checked })
                })
              }}
              label="Automatically bookmark events that you add yourself"
            />
            <SubTitle mt={4}>Your Account:</SubTitle>
            <Text mv={3}>
              Your email address currently can not be changed. If you need to
              change it, please contact us via email.
            </Text>
            <TextInput
              disabled
              value={formState.email}
              name="email"
              label="Email Address"
            />
            <TextInput
              value={formState.username.toLowerCase().trim()}
              error={
                usernameIsUnique === false
                  ? "Username already exists"
                  : formErrors.username
              }
              name="username"
              onChange={e =>
                setFormState({ ...formState, username: e.target.value })
              }
              label="Username"
              withSpinner={usernameIsChecking}
            />

            <FancyButton
              type="submit"
              block
              mb={4}
              disabled={formState.username === data.me.username}
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
  )
}

export const UpdateSelfForm = props => {
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
        return <Form loading={loading} error={error} data={data} {...props} />
      }}
    </Query>
  )
}
