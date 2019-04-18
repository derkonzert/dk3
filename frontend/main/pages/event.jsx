import { withRouter } from "next/router"
import styled from "@emotion/styled"
import { ListAndDetail, ListAndDetailMain } from "@dk3/ui/layouts/ListAndDetail"

import { EventDetail } from "../components/event-detail/EventDetail"

const Wrapper = styled.div`
  padding: 0 0 1rem;
  margin-top: 4rem;
  background: ${({ theme }) => theme.colors.boxBackground};
`

export default withRouter(function Event({ router }) {
  return (
    <ListAndDetail>
      <ListAndDetailMain>
        <Wrapper>
          <EventDetail id={router.query.eventId} />
        </Wrapper>
      </ListAndDetailMain>
    </ListAndDetail>
  )
})
