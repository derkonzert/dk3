import { withRouter } from "next/router"
import Head from "next/head"
import { UpdateEventForm } from "../components/update-event/UpdateEventForm"
import { Box } from "@dk3/ui/atoms/Boxes"
import styled from "@emotion/styled"

const Wrapper = styled.div`
  margin: 2rem auto;
  width: 100%;
  max-width: 42rem;
`

const Content = styled.div`
  width: 100%;
`

export default withRouter(function UpdateEvent({ router }) {
  return (
    <Wrapper>
      <Head>
        <title>Update event {router.query.eventId}</title>
        <meta
          name="description"
          content={`Update event ${router.query.eventId}`}
        />
      </Head>
      <Box>
        <Content>
          <UpdateEventForm id={router.query.eventId} />
        </Content>
      </Box>
    </Wrapper>
  )
})
