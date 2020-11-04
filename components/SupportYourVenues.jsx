import React from "react"
import styled from "@emotion/styled"

import { Title, Text } from "@dk3/ui/atoms/Typography"
import { spacings } from "@dk3/ui/theme/tokens"

const Container = styled.div`
  border-radius: 15px;
  border: 1px solid #d8d6d6;
  background: #fff;
  box-shadow: 7px 7px 13px #cfcece, -7px -7px 13px #ffffff;
  margin: 0 0 ${spacings.xl};
  padding: ${spacings.xl};
`

export function SupportYourVenues() {
  return (
    <Container>
      <Title>Support, if you can.</Title>
      <Text mv="m">
        This website is all about concerts and you probably love going to
        concerts as much as I do. But currently, all the people being involved
        in making these events happen, great artists, organizers, venues, labels
        and many more, face very hard times.
      </Text>
      <Text mv="m">
        So, please — if you are able to — support them in any possible way, so
        that we can have great concerts in the future.
      </Text>
      <Text mv="m">
        Although there are many ways you can help, here are some tips to get you
        going:
      </Text>
      <Text mv="m" as="ul" pl="l">
        <li>
          <strong>buy the records</strong>
          {" you're already streaming all the time"}
        </li>
        <li>
          <strong>buy solidary tickets</strong>
        </li>
        <li>
          <strong>{"don't insist"}</strong>
          {" on getting your money back for canceled shows"}
        </li>
        <li>
          <strong>buy tickets</strong>
          {" for future events, even though they might get cancelled"}
        </li>
        <li>
          <strong>ask others</strong> to do the same
        </li>
      </Text>
      <Text mv="m">
        {`Of course there are many other people aside from music events that
        currently need help, but since this is a concert platform, I
        specifically want to focus on those.`}
      </Text>
      <Text mv="m">
        {`Aside from this, stay healthy and sane, and don't listen to the
        confused, loud people.`}
      </Text>
    </Container>
  )
}
