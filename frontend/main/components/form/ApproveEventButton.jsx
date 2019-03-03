import { Mutation } from "react-apollo"
import gql from "graphql-tag"
import { CurrentUser } from "../../lib/CurrentUser"
import { hasSkill } from "../../lib/hasSkill"
import { Button } from "@dk3/ui/form/Button"
import { UPCOMING_EVENTS_EVENT_FRAGMENT } from "../list/EventList"

export const VERIFY_EVENT = gql`
  mutation approveEvent($input: ApproveEventInput!) {
    approveEvent(input: $input) {
      ...UpcomingEventsEvent
    }
  }
  ${UPCOMING_EVENTS_EVENT_FRAGMENT}
`

export const ApproveEventButton = ({ eventId, approved, children, ...props }) =>
  approved ? null : (
    <CurrentUser>
      {({ user }) =>
        hasSkill(user, "VERIFY_EVENT") ? (
          <Mutation
            mutation={VERIFY_EVENT}
            variables={{ input: { id: eventId, approved: !approved } }}
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
