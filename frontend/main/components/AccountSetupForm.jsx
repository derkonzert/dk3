import React, { useEffect } from "react"
import Link from "next/link"
import { withRouter } from "next/router"
import { Mutation, Query } from "react-apollo"
import gql from "graphql-tag"
import { State } from "react-powerplug"

import { Spinner } from "@dk3/ui/atoms/Spinner"
import { VeryFancyButton, Button, VeryFancyLink } from "@dk3/ui/form/Button"

import { Text, Title, Link as UiLink } from "@dk3/ui/atoms/Typography"
import { ErrorMessage } from "@dk3/ui/atoms/Message"
import { StepsView } from "./StepsView"

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

export const AccountSetupForm = withRouter(({ router }) => {
  const lastStep = React.useRef()
  const step = router.query.step ? parseInt(router.query.step, 10) : 0

  useEffect(() => {
    lastStep.current = step
  })

  function nextStep() {
    router.push(`/setup?step=${step + 1}`, `/account/setup/${step + 1}`, {
      shallow: true,
    })
  }

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
                    submitting: false,
                  })

                  nextStep()
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
                    <StepsView
                      data-account-setup-form
                      backwards={lastStep.current && lastStep.current > step}
                    >
                      {step === 0 && (
                        <React.Fragment key="welcome">
                          <Title mt="l">Congratulations!</Title>

                          <Text mv="m">
                            Your new account is now ready to use! There are a
                            few settings, that you might want to have a quick
                            look at.
                          </Text>
                          <VeryFancyButton
                            pv="m"
                            ph="l"
                            mv="s"
                            onClick={() => nextStep()}
                          >
                            {"Setup my account!"}
                          </VeryFancyButton>
                        </React.Fragment>
                      )}

                      {step === 1 && (
                        <React.Fragment key="bookmarking">
                          <Title mt="l">Auto-Bookmarking</Title>

                          <Text mt="m" mb="l">
                            When you add an event to the derkonzert list, would
                            like us to automatically bookmark it for you?
                          </Text>

                          <Button
                            disabled={state.submitting}
                            mh="s"
                            onClick={() => saveChanges("autoBookmark", false)}
                          >
                            No thanks
                          </Button>

                          <VeryFancyButton
                            disabled={state.submitting}
                            mv="s"
                            onClick={() => saveChanges("autoBookmark", true)}
                          >
                            Yes please!
                          </VeryFancyButton>
                        </React.Fragment>
                      )}
                      {step === 2 && (
                        <React.Fragment key="notify">
                          <Title mt="l">Notifications</Title>

                          <Text mt="m" mb="l">
                            Do you want us to send you an email, when new events
                            have been added, or one of your bookmarked events
                            changed?
                          </Text>

                          <Button
                            disabled={state.submitting}
                            mh="s"
                            onClick={() => saveChanges("sendEmails", false)}
                          >
                            No thanks
                          </Button>

                          <VeryFancyButton
                            disabled={state.submitting}
                            mv="s"
                            onClick={() => saveChanges("sendEmails", true)}
                          >
                            Yes please!
                          </VeryFancyButton>
                        </React.Fragment>
                      )}

                      {step === 3 && (
                        <React.Fragment key="username">
                          <Title mt="l">Public Username</Title>

                          <Text mt="m" mb="l">
                            Would you like to have your username displayed
                            publically next to events that you have added, or
                            bookmarked?
                          </Text>

                          <Button
                            disabled={state.submitting}
                            mh="s"
                            onClick={() => saveChanges("publicUsername", false)}
                          >
                            No thanks
                          </Button>

                          <VeryFancyButton
                            disabled={state.submitting}
                            mv="s"
                            onClick={() => saveChanges("publicUsername", true)}
                          >
                            Yes please!
                          </VeryFancyButton>
                        </React.Fragment>
                      )}

                      {step === 4 && (
                        <React.Fragment key="finished">
                          <Title mt="l">All setup!</Title>

                          <Text mt="m" mb="l">
                            And that was that. You did great! If you change your
                            mind, you can always update your settings on the
                            <Link href="/" as="/account/" passHref>
                              <UiLink>Settings page</UiLink>
                            </Link>
                            .
                          </Text>

                          <VeryFancyLink pv="m" ph="l" href="/">
                            Go to derkonzert
                          </VeryFancyLink>
                        </React.Fragment>
                      )}
                    </StepsView>
                  )
                }}
              </Mutation>
            )}
          </State>
        )
      }}
    </Query>
  )
})
