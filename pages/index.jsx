import React, { useState } from "react"
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

import { FooterLinks } from "../components/FooterLinks"

import { CurrentUser } from "../components/CurrentUser"
import { SentryErrorBoundary } from "../components/SentryErrorBoundary"
import { eventHref } from "../lib/eventHref"
import { EventLegend } from "../components/list/EventLegend"

import { HeaderMenu } from "../components/HeaderMenu/HeaderMenu"
import { Flex } from "@dk3/ui/atoms/Flex"
import { Spinner } from "@dk3/ui/atoms/Spinner"
import { SupportYourVenues } from "../components/SupportYourVenues"

const Main = Spacer.withComponent("main")

const DynamicEventDetail = dynamic(
  () =>
    import("../components/event-detail/EventDetail").then(
      (mod) => mod.EventDetail
    ),
  { loading: Spinner }
)
const DynamicCreateEventForm = dynamic(
  () =>
    import("../components/form/CreateEventForm").then(
      (mod) => mod.CreateEventForm
    ),
  { loading: Spinner }
)

const DynamicUpdateEventForm = dynamic(
  () =>
    import("../components/update-event/UpdateEventForm").then(
      (mod) => mod.UpdateEventForm
    ),
  { loading: Spinner }
)

const DK_DESCRIPTION = "A user curated list of fine concerts in Munich."

export default withRouter(function Index({ router }) {
  const {
    query: { editMode, eventId, addEvent },
  } = router
  const [filter, setFilter] = useState("all")

  const showDetail = !!eventId || !!addEvent
  const closeDetail = (e) => {
    e.preventDefault()

    if (editMode) {
      return
    }

    router.push("/")
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
              <LogoTitle mb="m">derkonzert</LogoTitle>
              <Slogan>
                {DK_DESCRIPTION}{" "}
                <Link passHref href="/about">
                  <UILink>Read more…</UILink>
                </Link>
              </Slogan>
            </Header>

            <Main pa="l">
              <SupportYourVenues />
              <EventList
                filter={filter}
                onFilterChange={(filter) => setFilter(filter)}
              />
            </Main>
          </CenteredContent>
          <Footer>
            <CenteredContent>
              <Spacer ph="l">
                <Flex flexDirection="column" alignItems="center">
                  <EventLegend />
                </Flex>

                <div
                  style={{
                    maxWidth: "45rem",
                    margin: "0 auto",
                    width: "100%",
                  }}
                >
                  <Title>About derkonzert</Title>
                  <Text mv="m">
                    This website is a non-commercial project, that allows
                    enthusiastic concert visitors to curate a list of events for
                    Munich (Germany).
                  </Text>
                  <Text mv="m">
                    Its purposes are the discovery of new music, not missing
                    important concerts and enhancing Munichs concert culture.
                  </Text>
                  <Text mv="m">
                    All events are maintained manually by its visitors and
                    users.
                  </Text>
                  <Text mv="m">
                    The event list is not limited to certain genres or musical
                    styles. Everyone is invited to participate and to
                    contribute.
                  </Text>
                  <Text mv="m">
                    Registered users can receive email notifications about
                    updates to the list, bookmark events they would like to
                    visit, and sync those into their calendars.
                  </Text>
                  <CurrentUser>
                    {({ isLoggedIn }) =>
                      !isLoggedIn ? (
                        <Text mv="m">
                          <Link href="/account/signup" passHref>
                            <UILink>Create an account</UILink>
                          </Link>
                        </Text>
                      ) : null
                    }
                  </CurrentUser>
                  <Text mv="m">
                    The entire project is open source and{" "}
                    <UILink href="https://github.com/jkempff/dk3">
                      available on github
                    </UILink>
                    .
                  </Text>
                </div>
                <FooterLinks />
              </Spacer>
            </CenteredContent>
          </Footer>
        </ListAndDetailMain>
        <ListAndDetailSide requestClose={closeDetail}>
          {!!eventId &&
            (editMode ? (
              <DynamicUpdateEventForm id={eventId} />
            ) : (
              <DynamicEventDetail id={eventId} />
            ))}
          {!!addEvent && (
            <DynamicCreateEventForm
              onCreated={(event) => {
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
