import React, { useState, useEffect } from "react"
import { Mutation, Query } from "react-apollo"
import gql from "graphql-tag"

import { LoginDialog } from "./form/LoginDialog"

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
}) => {
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    if (showDialog === false && cachedMutation) {
      cachedMutation = null
    }
  }, [showDialog])

  return (
    <Query query={USER_AUTH_INFO} fetchPolicy="cache-first">
      {({ loading, error, data }) => {
        const requireAuthentication = mutate => mutationData => {
          if (!loading && !error && !data.me) {
            // Not authenticated, store mutation and data in callback for later
            cachedMutation = () => mutate(mutationData)
            // Show login dialog to the user
            setShowDialog(true)
          } else {
            return mutate(mutationData)
          }
        }

        const onLoginOrSignUp = () => {
          cachedMutation()
          setShowDialog(false)
        }

        const onCancel = () => {
          setShowDialog(false)
        }

        return (
          <React.Fragment>
            <Mutation {...props}>
              {mutate => children(requireAuthentication(mutate))}
            </Mutation>

            {
              <LoginDialog
                key="mwa-dialog"
                isOpen={showDialog}
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
  )
}
