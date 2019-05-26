import { withRouter } from "next/router"
import styled from "@emotion/styled"
import { ListAndDetail, ListAndDetailMain } from "@dk3/ui/layouts/ListAndDetail"

import { EventDetail } from "../components/event-detail/EventDetail"
import { SentryErrorBoundary } from "@dk3/shared-frontend/lib/SentryErrorBoundary"

const Wrapper = styled.div`
  padding: 0 0 1rem;
  margin-top: 4rem;
  background: ${({ theme }) => theme.colors.boxBackground};
`

const EventPage = function Event({ router }) {
  return (
    <SentryErrorBoundary>
      <ListAndDetail>
        <ListAndDetailMain>
          <Wrapper>
            <EventDetail id={router.query.eventId} />
          </Wrapper>
        </ListAndDetailMain>
      </ListAndDetail>
    </SentryErrorBoundary>
  )
}

// EventPage.getInitialProps = ctx => {
//   console.log(ctx)

//   return {}
// }

export default withRouter(EventPage)
