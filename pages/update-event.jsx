import { withRouter } from "next/router"
import Head from "next/head"
import { UpdateEventForm } from "../components/update-event/UpdateEventForm"
import { Box } from "@dk3/ui/atoms/Boxes"
import styled from "@emotion/styled"
import { SentryErrorBoundary } from "../components/SentryErrorBoundary"

const Wrapper = styled.div`
  margin: 2rem auto;
  width: 100%;
  max-width: 42rem;
`

const Content = styled.div`
  width: 100%;
`

const extractIdFromPath = path => {
  const match = path.match(/\/update-event\/(.*)$/)

  if (match) {
    return match[1]
  } else {
    return undefined
  }
}

export default withRouter(function UpdateEvent({ router }) {
  const eventId = router.query.eventId || extractIdFromPath(router.asPath)

  return (
    <SentryErrorBoundary>
      <Wrapper>
        <Head>
          <title>Update event {eventId}</title>
          <meta name="description" content={`Update event ${eventId}`} />
        </Head>
        <Box>
          <Content>
            <UpdateEventForm id={eventId} />
          </Content>
        </Box>
      </Wrapper>
    </SentryErrorBoundary>
  )
})
