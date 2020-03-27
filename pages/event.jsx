import { withRouter } from "next/router"
import styled from "@emotion/styled"
import { ListAndDetail, ListAndDetailMain } from "@dk3/ui/layouts/ListAndDetail"

import { EventDetail } from "../components/event-detail/EventDetail"
import { SentryErrorBoundary } from "../components/SentryErrorBoundary"
import { Spacer } from "@dk3/ui/atoms/Spacer"

const Wrapper = styled(Spacer)`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.boxBackground};
`

const extractIdFromPath = path => {
  const match = path.match(/\/event\/(.)*-(?<eventId>.*)$/)
  if (match) {
    return match[2]
  } else {
    return undefined
  }
}

const EventPage = function Event({ router }) {
  const eventId = !router.query.eventId
    ? extractIdFromPath(router.asPath)
    : router.query.eventId

  return (
    <SentryErrorBoundary>
      <ListAndDetail>
        <ListAndDetailMain>
          <Wrapper pa="l">
            <EventDetail id={eventId} />
          </Wrapper>
        </ListAndDetailMain>
      </ListAndDetail>
    </SentryErrorBoundary>
  )
}

export default withRouter(EventPage)
