import React from "react"
import { withRouter } from "next/router"
import Link from "next/link"
import dynamic from "next/dynamic"

import {
  ListAndDetail,
  ListAndDetailMain,
  ListAndDetailSide,
  CenteredContent,
} from "@dk3/ui/layouts/ListAndDetail"

import { EventList } from "../components/list/EventList"

import {
  MegaTitle,
  Text,
  Title,
  Link as UILink,
} from "@dk3/ui/atoms/Typography"
import { Header } from "@dk3/ui/layouts/Header"
import { Spacer } from "@dk3/ui/atoms/Spacer"
import { Footer } from "@dk3/ui/components/Footer"

import { FooterLinks } from "@dk3/shared-frontend/lib/FooterLinks"

import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"
import { eventHref } from "@dk3/shared-frontend/lib/eventHref"
import { EventLegend } from "../components/list/EventLegend"

import { HeaderMenu } from "../components/HeaderMenu/HeaderMenu"
import { Flex } from "@dk3/ui/atoms/Flex"

const DynamicEventDetail = dynamic(() =>
  import("../components/event-detail/EventDetail").then(mod => mod.EventDetail)
)
const DynamicCreateEventForm = dynamic(() =>
  import("../components/form/CreateEventForm").then(mod => mod.CreateEventForm)
)

export default withRouter(function Index({ router, themeName, onThemeChange }) {
  const {
    query: { eventId, addEvent },
  } = router
  const showDetail = !!eventId || !!addEvent
  const closeDetail = e => {
    e.preventDefault()
    router.push("/")
  }

  return (
    <ListAndDetail showDetail={showDetail}>
      <ListAndDetailMain>
        <CenteredContent>
          <HeaderMenu />
          <CurrentUser>
            {({ isLoggedIn }) => (
              <Header compact={isLoggedIn}>
                <MegaTitle>derkonzert</MegaTitle>

                <Text>
                  {
                    "derkonzert is a simple list of concerts in Munich. It's supposed to be a haystack of needles, without any boundaries to any specific music style. "
                  }
                  <Link passHref href="/pages/about">
                    <UILink>Learn more about derkonzert</UILink>
                  </Link>
                  .
                </Text>
              </Header>
            )}
          </CurrentUser>

          <Spacer pa={4}>
            <EventList />
          </Spacer>
        </CenteredContent>
        <Footer>
          <CenteredContent>
            <Spacer ph={4}>
              <Flex flexDirection="column" alignItems="center">
                <EventLegend />
              </Flex>

              <div
                style={{ maxWidth: "45rem", margin: "0 auto", width: "100%" }}
              >
                <Title>About derkonzert</Title>
                <Text mv={3}>
                  This website is a non-commercial project, that allows
                  enthusiastic concert visitors to curate a list of events for
                  Munich (Germany).
                </Text>
                <Text mv={3}>
                  Its purposes are the discovery of new music, not missing
                  important concerts and enhancing Munichs concert culture.
                </Text>
                <Text mv={3}>
                  All events are maintained manually by its visitors and users.
                </Text>
                <Text mv={3}>
                  The event list is not limited to certain genres or musical
                  styles. Everyone is invited to participate and to contribute.
                </Text>
                <Text mv={3}>
                  Registered users can receive email notifications about updates
                  to the list, bookmark events they would like to visit, and
                  sync those into their calendars.
                </Text>
                <CurrentUser>
                  {({ isLoggedIn }) =>
                    !isLoggedIn ? (
                      <Text mv={3}>
                        <Link href="/account/signup" passHref>
                          <UILink>Create an account</UILink>
                        </Link>
                      </Text>
                    ) : null
                  }
                </CurrentUser>
                <Text mv={3}>
                  The entire project is open source and{" "}
                  <UILink href="https://github.com/jkempff/dk3">
                    available on github
                  </UILink>
                  .
                </Text>
              </div>
              <FooterLinks
                themeName={themeName}
                onThemeChange={e => {
                  onThemeChange(e.target.checked ? "dark" : "light")
                }}
              />
            </Spacer>
          </CenteredContent>
        </Footer>
      </ListAndDetailMain>
      <ListAndDetailSide requestClose={closeDetail}>
        {!!eventId && (
          <React.Fragment>
            <DynamicEventDetail id={eventId} />
          </React.Fragment>
        )}
        {!!addEvent && (
          <DynamicCreateEventForm
            onCreated={event => {
              router.replace(`/?eventId=${event.id}`, eventHref(event), {
                shallow: true,
              })
            }}
          />
        )}
      </ListAndDetailSide>
    </ListAndDetail>
  )
})
