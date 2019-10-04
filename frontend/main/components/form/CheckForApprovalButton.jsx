import { Query } from "react-apollo"
import gql from "graphql-tag"
import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"
import { hasSkill } from "@dk3/shared-frontend/lib/hasSkill"
import { ButtonLink } from "@dk3/ui/form/Button"
import { generateSearchLink } from "./generateSearchLink"
import { ErrorMessage } from "@dk3/ui/atoms/Message"
import { Spinner } from "@dk3/ui/atoms/Spinner"
import { safeHref } from "@dk3/shared-frontend/lib/safeHref"

export const EVENT_DETAIL = gql`
  query eventDetail($id: ID!) {
    event(id: $id) {
      url
      title
      location
      from
    }
  }
`

export const CheckForApprovalButton = ({ eventId, children, ...props }) => (
  <CurrentUser>
    {({ user }) =>
      hasSkill(user, "APPROVE_EVENT") ? (
        <Query query={EVENT_DETAIL} variables={{ id: eventId }}>
          {({ loading, error, data }) => {
            if (error) {
              return <ErrorMessage>Error loading event data</ErrorMessage>
            }
            if (loading) {
              return <Spinner pv="xxl">Loading</Spinner>
            }

            const { event } = data

            return (
              <ButtonLink
                href={
                  event.url ? safeHref(event.url) : generateSearchLink(event)
                }
                target="_blank"
                rel="noopener nofollow"
                {...props}
              >
                {children}
              </ButtonLink>
            )
          }}
        </Query>
      ) : null
    }
  </CurrentUser>
)
