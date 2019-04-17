import React from "react"
import Link from "next/link"
import { Mutation, Query } from "react-apollo"
import gql from "graphql-tag"
import { State } from "react-powerplug"

import { Spinner } from "@dk3/ui/atoms/Spinner"
import { FancyButton } from "@dk3/ui/form/Button"
import { TextInput } from "@dk3/ui/form/TextInput"
import { Spacer } from "@dk3/ui/atoms/Spacer"
import { Small, Link as UILink } from "@dk3/ui/atoms/Typography"
import { currentUserQuery } from "@dk3/shared-frontend/lib/CurrentUser"
import { Message } from "@dk3/ui/atoms/Message"

export const USER_DATA_FRAGMENT = gql`
  fragment UserData on User {
    id
    username
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
                  return (
                    <Spacer pa={4}>
                      <form
                        data-add-event-form
                        onSubmit={e => {
                          const { username } = state

                          e.preventDefault()

                          /* TODO: dont allow just any username */

                          updateSelf({
                            variables: {
                              input: {
                                id: data.me.id,
                                username: username.trim(),
                              },
                            },
                          })
                        }}
                      >
                        <TextInput
                          disabled
                          value={state.email}
                          name="email"
                          label="Email Address"
                        />

                        <TextInput
                          value={state.username.trim()}
                          name="username"
                          onChange={e => setState({ username: e.target.value })}
                          label="Username"
                        />

                        {state.showSuccess &&
                          state.username === data.me.username && (
                            <Message>
                              Your username is now &quot;
                              {state.username}&quot;
                            </Message>
                          )}

                        <FancyButton
                          type="submit"
                          block
                          mv={5}
                          disabled={state.username === data.me.username}
                        >
                          Update your settings
                        </FancyButton>

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
