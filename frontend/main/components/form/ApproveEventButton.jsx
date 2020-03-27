import { Mutation } from "react-apollo"
import gql from "graphql-tag"
import { Button } from "@dk3/ui/form/Button"
import { UPCOMING_EVENTS_EVENT_FRAGMENT } from "../list/EventList"
import { CurrentUser } from "../../lib/CurrentUser"
import { hasSkill } from "../../lib/hasSkill"

export const APPROVE_EVENT = gql`
  mutation approveEvent($input: ApproveEventInput!) {
    approveEvent(input: $input) {
      ...UpcomingEventsEvent
    }
  }
  ${UPCOMING_EVENTS_EVENT_FRAGMENT}
`

export const ApproveEventButton = ({ eventId, children, ...props }) => (
  <CurrentUser>
    {({ user }) =>
      hasSkill(user, "APPROVE_EVENT") ? (
        <Mutation
          mutation={APPROVE_EVENT}
          variables={{ input: { id: eventId, approved: true } }}
        >
          {approveEvent => (
            <Button {...props} onClick={approveEvent}>
              {children}
            </Button>
          )}
        </Mutation>
      ) : null
    }
  </CurrentUser>
)
