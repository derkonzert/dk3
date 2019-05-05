import React, { useState } from "react"
import { Mutation } from "react-apollo"
import gql from "graphql-tag"
import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"
import { hasSkill } from "@dk3/shared-frontend/lib/hasSkill"
import { Button, VeryFancyButton } from "@dk3/ui/form/Button"
import { UPCOMING_EVENTS_EVENT_FRAGMENT } from "../list/EventList"
import { Dialog } from "@dk3/ui/components/Dialog"
import { Flex } from "@dk3/ui/atoms/Flex"
import { Title, Text } from "@dk3/ui/atoms/Typography"
import styled from "@emotion/styled"

export const DELETE_EVENT = gql`
  mutation deleteEvent($input: DeleteEventInput!) {
    deleteEvent(input: $input) {
      ...UpcomingEventsEvent
    }
  }
  ${UPCOMING_EVENTS_EVENT_FRAGMENT}
`

const DeleteButton = styled(Button)`
  color: ${({ theme }) => theme.colors.deleteButtonColor};
`

export const DeleteEventButton = ({ eventId, onClick, children, ...props }) => {
  const [showConfirmation, setShowConfirmation] = useState(false)

  return (
    <CurrentUser>
      {({ user }) =>
        hasSkill(user, "DELETE_EVENT") ? (
          <Mutation
            mutation={DELETE_EVENT}
            update={() => {
              onClick && onClick()
            }}
            variables={{ input: { id: eventId } }}
          >
            {deleteEvent => (
              <React.Fragment>
                <DeleteButton
                  {...props}
                  type="button"
                  onClick={() => setShowConfirmation(true)}
                >
                  {children}
                </DeleteButton>
                <Dialog isOpen={showConfirmation}>
                  <Title>Delete event?</Title>
                  <Text mb={3}>
                    Are you sure about this? It cannot be undone.
                  </Text>
                  <Flex>
                    <Button mr={2} onClick={() => setShowConfirmation(false)}>
                      Cancel
                    </Button>
                    <VeryFancyButton ml={2} onClick={deleteEvent}>
                      Yes, Delete!
                    </VeryFancyButton>
                  </Flex>
                </Dialog>
              </React.Fragment>
            )}
          </Mutation>
        ) : null
      }
    </CurrentUser>
  )
}
