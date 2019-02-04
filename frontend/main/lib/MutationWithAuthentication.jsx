import React from "react"
import { Mutation, Query } from "react-apollo"
import gql from "graphql-tag"
import { State } from "react-powerplug"

import { LoginForm } from "../components/form/LoginForm"
import { Dialog } from "@dk3/ui/components/Dialog"
import { SubTitle, Description } from "@dk3/ui/atoms/Typography"

export const USER_AUTH_INFO = gql`
  query userId {
    me {
      id
    }
  }
`

let cachedMutation

export const MutationWithAuthentication = ({
  children,
  notLoggedInMessage,
  ...props
}) => (
  <State initial={{ showDialog: false }}>
    {({ state, setState }) => (
      <Query query={USER_AUTH_INFO} fetchPolicy="cache-first">
        {({ loading, error, data }) => {
          const requireAuthentication = mutate => mutationData => {
            if (!loading && !error && !data.me) {
              // Not authenticated, store mutation and data in callback for later
              cachedMutation = () => mutate(mutationData)
              // Show login dialog to the user
              setState({ showDialog: true })
            } else {
              return mutate(mutationData)
            }
          }

          return (
            <React.Fragment>
              <Mutation {...props}>
                {mutate => children(requireAuthentication(mutate))}
              </Mutation>
              {!!state.showDialog && (
                <Dialog>
                  <SubTitle>Login Required</SubTitle>
                  <Description>{notLoggedInMessage}</Description>
                  <LoginForm
                    onLogin={() => {
                      setState({ showDialog: false }, () => {
                        if (cachedMutation) {
                          cachedMutation()
                          cachedMutation = null
                        }
                      })
                    }}
                  />
                </Dialog>
              )}
            </React.Fragment>
          )
        }}
      </Query>
    )}
  </State>
)
