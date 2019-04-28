import React from "react"
import { Mutation, Query } from "react-apollo"
import gql from "graphql-tag"
import { State } from "react-powerplug"

import { LoginDialog } from "../form/LoginDialog"

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
  <State initial={{ showDialog: false, formType: "login" }}>
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

          const onLoginOrSignUp = () =>
            setState({ showDialog: false }, () => {
              if (cachedMutation) {
                cachedMutation()
                cachedMutation = null
              }
            })

          const onCancel = () => {
            setState({ showDialog: false }, () => {
              cachedMutation = null
            })
          }

          return (
            <React.Fragment>
              <Mutation {...props}>
                {mutate => children(requireAuthentication(mutate))}
              </Mutation>

              {
                <LoginDialog
                  key="mwa-dialog"
                  isOpen={state.showDialog}
                  title="Login Required"
                  description={notLoggedInMessage}
                  onLogin={onLoginOrSignUp}
                  onCancel={onCancel}
                />
              }
            </React.Fragment>
          )
        }}
      </Query>
    )}
  </State>
)
