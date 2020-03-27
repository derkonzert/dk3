import { withRouter } from "next/router"
import styled from "@emotion/styled"
import { ListAndDetail, ListAndDetailMain } from "@dk3/ui/layouts/ListAndDetail"
import { CreateEventForm } from "../components/form/CreateEventForm"

import { SentryErrorBoundary } from "../lib/SentryErrorBoundary"
import { Spacer } from "@dk3/ui/atoms/Spacer"
import { eventHref } from "../lib/eventHref"

const Wrapper = styled(Spacer)`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.boxBackground};
`

export default withRouter(function CreateNewEvent({ router }) {
  return (
    <SentryErrorBoundary>
      <ListAndDetail>
        <ListAndDetailMain>
          <Wrapper pa="l">
            <CreateEventForm
              onCreated={event => {
                router.replace(`/?eventId=${event.id}`, eventHref(event), {
                  shallow: true,
                })
              }}
            />
          </Wrapper>
        </ListAndDetailMain>
      </ListAndDetail>
    </SentryErrorBoundary>
  )
})
