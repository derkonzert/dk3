import React from "react"

import { Mutation, Query } from "react-apollo"
import gql from "graphql-tag"
import { State } from "react-powerplug"

import { Spinner } from "@dk3/ui/atoms/Spinner"
import { VeryFancyButton, Button, VeryFancyLink } from "@dk3/ui/form/Button"

import { SubTitle, Text } from "@dk3/ui/atoms/Typography"
import { ErrorMessage } from "@dk3/ui/atoms/Message"

export const ACCOUNT_SETUP_FRAGMENT = gql`
  fragment AccountSetupUserFragment on User {
    id
    username
    sendEmails
    publicUsername
    autoBookmark
  }
`

export const ACCOUNT_SETUP = gql`
  query {
    me {
      ...AccountSetupUserFragment
    }
  }
  ${ACCOUNT_SETUP_FRAGMENT}
`

export const UPDATE_SELF = gql`
  mutation updateSelf($input: UpdateSelfInput!) {
    updateSelf(input: $input) {
      ...AccountSetupUserFragment
    }
  }
  ${ACCOUNT_SETUP_FRAGMENT}
`

export const AccountSetupForm = () => {
  return (
    <Query query={ACCOUNT_SETUP}>
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
              step: 0,
              submitting: false,
              publicUsername: data.me.publicUsername,
              autoBookmark: data.me.autoBookmark,
              sendEmails: data.me.sendEmails,
            }}
          >
            {({ state, setState }) => (
              <Mutation
                mutation={UPDATE_SELF}
                update={() => {
                  setState({
                    step: state.step + 1,
                    submitting: false,
                  })
                }}
              >
                {updateSelf => {
                  function saveChanges(key, value) {
                    setState({ submitting: true })
                    updateSelf({
                      variables: {
                        input: {
                          id: data.me.id,
                          [key]: value,
                        },
                      },
                    })
                  }
                  return (
                    <div data-account-setup-form>
                      {state.step === 0 && (
                        <React.Fragment>
                          <SubTitle mt={4}>Congratulations!</SubTitle>

                          <Text mv={3}>
                            Your new account is now ready to use! There are a
                            few settings, that you might want to have a quick
                            look at.
                          </Text>
                          <VeryFancyButton
                            mv={2}
                            onClick={() => setState({ step: 1 })}
                          >
                            {"Setup my account!"}
                          </VeryFancyButton>
                        </React.Fragment>
                      )}

                      {state.step === 1 && (
                        <React.Fragment>
                          <SubTitle mt={4}>Auto-Bookmarking (1 of 3)</SubTitle>

                          <Text mv={3}>
                            When you add an event to the derkonzert list, would
                            like us to automatically bookmark it for you?
                          </Text>

                          <Button
                            disabled={state.submitting}
                            mh={2}
                            onClick={() => saveChanges("autoBookmark", false)}
                          >
                            No thanks
                          </Button>

                          <VeryFancyButton
                            disabled={state.submitting}
                            mv={2}
                            onClick={() => saveChanges("autoBookmark", true)}
                          >
                            Yes please!
                          </VeryFancyButton>
                        </React.Fragment>
                      )}
                      {state.step === 2 && (
                        <React.Fragment>
                          <SubTitle mt={4}>Notifications (2 of 3)</SubTitle>

                          <Text mv={3}>
                            Do you want us to send you an email, when new events
                            have been added, or one of your bookmarked events
                            changed?
                          </Text>

                          <Button
                            disabled={state.submitting}
                            mh={2}
                            onClick={() => saveChanges("sendEmails", false)}
                          >
                            No thanks
                          </Button>

                          <VeryFancyButton
                            disabled={state.submitting}
                            mv={2}
                            onClick={() => saveChanges("sendEmails", true)}
                          >
                            Yes please!
                          </VeryFancyButton>
                        </React.Fragment>
                      )}

                      {state.step === 3 && (
                        <React.Fragment>
                          <SubTitle mt={4}>Public Username (3 of 3)</SubTitle>

                          <Text mv={3}>
                            Would you like to have your username displayed
                            publically next to events that you have added, or
                            bookmarked?
                          </Text>

                          <Button
                            disabled={state.submitting}
                            mh={2}
                            onClick={() => saveChanges("publicUsername", false)}
                          >
                            No thanks
                          </Button>

                          <VeryFancyButton
                            disabled={state.submitting}
                            mv={2}
                            onClick={() => saveChanges("publicUsername", true)}
                          >
                            Yes please!
                          </VeryFancyButton>
                        </React.Fragment>
                      )}

                      {state.step === 4 && (
                        <React.Fragment>
                          <SubTitle mt={4}>All setup!</SubTitle>

                          <Text mv={3}>
                            And that was that. You did great! If you change your
                            mind, you can always update your settings on the
                            Settings page.
                          </Text>

                          <VeryFancyLink href="/">
                            Go to derkonzert
                          </VeryFancyLink>
                        </React.Fragment>
                      )}
                    </div>
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
