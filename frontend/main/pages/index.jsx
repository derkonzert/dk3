import React from "react"
import Head from "next/head"
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
  Text,
  Title,
  Link as UILink,
  Slogan,
  LogoTitle,
} from "@dk3/ui/atoms/Typography"
import { Header } from "@dk3/ui/layouts/Header"
import { Spacer } from "@dk3/ui/atoms/Spacer"
import { Footer } from "@dk3/ui/components/Footer"

import { FooterLinks } from "@dk3/shared-frontend/lib/FooterLinks"

import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"
import { SentryErrorBoundary } from "@dk3/shared-frontend/lib/SentryErrorBoundary"
import { eventHref } from "@dk3/shared-frontend/lib/eventHref"
import { EventLegend } from "../components/list/EventLegend"

import { HeaderMenu } from "../components/HeaderMenu/HeaderMenu"
import { Flex } from "@dk3/ui/atoms/Flex"
import { Spinner } from "@dk3/ui/atoms/Spinner"

const Main = Spacer.withComponent("main")

const DynamicEventDetail = dynamic(
  () =>
    import("../components/event-detail/EventDetail").then(
      mod => mod.EventDetail
    ),
  { loading: Spinner }
)
const DynamicCreateEventForm = dynamic(
  () =>
    import("../components/form/CreateEventForm").then(
      mod => mod.CreateEventForm
    ),
  { loading: Spinner }
)

const DynamicUpdateEventForm = dynamic(
  () =>
    import("../components/update-event/UpdateEventForm").then(
      mod => mod.UpdateEventForm
    ),
  { loading: Spinner }
)

const DK_DESCRIPTION = "A user curated list of fine concerts in Munich."

export default withRouter(function Index({ router, themeName, onThemeChange }) {
  const {
    query: { editMode, eventId, addEvent, showMine },
  } = router

  const showDetail = !!eventId || !!addEvent
  const closeDetail = e => {
    e.preventDefault()
    if (showMine) {
      router.push("/?showMine=1", "/mine")
    } else {
      router.push("/")
    }
  }

  return (
    <SentryErrorBoundary>
      <ListAndDetail showDetail={showDetail}>
        <ListAndDetailMain>
          <CenteredContent>
            <Head>
              <title>derkonzert – concert community in Munich</title>
              <meta name="description" content={DK_DESCRIPTION} />
            </Head>
            <HeaderMenu />

            <Header>
              <LogoTitle mb={3}>derkonzert</LogoTitle>
              <Slogan>
                {DK_DESCRIPTION}{" "}
                <Link passHref href="/pages/about">
                  <UILink>Read more…</UILink>
                </Link>
              </Slogan>
            </Header>

            <Main pa={4}>
              <EventList />
            </Main>
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
                    All events are maintained manually by its visitors and
                    users.
                  </Text>
                  <Text mv={3}>
                    The event list is not limited to certain genres or musical
                    styles. Everyone is invited to participate and to
                    contribute.
                  </Text>
                  <Text mv={3}>
                    Registered users can receive email notifications about
                    updates to the list, bookmark events they would like to
                    visit, and sync those into their calendars.
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
          {!!eventId &&
            (editMode ? (
              <DynamicUpdateEventForm id={eventId} />
            ) : (
              <DynamicEventDetail id={eventId} showMine={showMine} />
            ))}
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
    </SentryErrorBoundary>
  )
})
