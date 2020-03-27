import React, { useState } from "react"
import { useMutation } from "react-apollo"
import gql from "graphql-tag"
import { withRouter } from "next/router"

import { withUserRole } from "../lib/withUserRole"
import { Spacer } from "@dk3/ui/atoms/Spacer"
import { TextInput } from "@dk3/ui/form/TextInput"
import { DateTimeInput } from "@dk3/ui/form/DateTimeInput"
import { VeryFancyButton } from "@dk3/ui/form/Button"
import { Title } from "@dk3/ui/atoms/Typography"
import { SimilarEventsList } from "./SimilarEventsList"
import { ErrorMessage, SuccessMessage } from "@dk3/ui/atoms/Message"

const IMPORT_EVENT = gql`
  mutation importEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
    }
  }
`

const getInitialFormState = router => {
  try {
    const state = { ...router.query }

    if (state.from) {
      state.from = new Date(state.from)
    }

    if (state.to) {
      state.to = new Date(state.to)
    }

    if (!state.title) {
      return null
    }

    return state
  } catch (err) {
    return null
  }
}

const formStateToInput = formState => ({
  ...formState,
  from: formState.from.toISOString(),
  to: formState.to ? formState.to.toISOString() : undefined,
})

const Form = Spacer.withComponent("form")

export const ImportEventForm = withRouter(
  withUserRole(
    ({ router }) => {
      const initialState = getInitialFormState(router)
      const [formState, setFormState] = useState(initialState)
      const [formErrors, setFormErrors] = useState([])
      const [importEvent, { error, data: mutationData }] = useMutation(
        IMPORT_EVENT
      )

      if (!formState) {
        return <ErrorMessage>Valid import data missing</ErrorMessage>
      }

      if (mutationData && mutationData.createEvent.id) {
        return (
          <Spacer ma="xl">
            <SuccessMessage>
              {`Imported new event with ID "${mutationData.createEvent.id}"`}
            </SuccessMessage>
          </Spacer>
        )
      }

      return (
        <Form
          ma="xl"
          onSubmit={e => {
            e.preventDefault()

            const errors = []

            if (!formState.from) {
              errors.push(["from", "From date is missing"])
            }

            if (!formState.title) {
              errors.push(["title", "Title is missing"])
            }

            if (!formState.location) {
              errors.push(["location", "Location is missing"])
            }

            if (errors.length) {
              setFormErrors(errors)
            } else {
              setFormErrors([])
              importEvent({ variables: { input: formStateToInput(formState) } })
            }
          }}
        >
          <Spacer mv="m">
            <SimilarEventsList title={initialState.title} />
          </Spacer>
          {!!formErrors.length && (
            <Spacer mv="l">
              {formErrors.map(([id, error]) => (
                <ErrorMessage key={id}>{error}</ErrorMessage>
              ))}
            </Spacer>
          )}
          <Title>Import Event</Title>
          <TextInput
            label="Title"
            name="title"
            value={formState.title}
            onChange={e => {
              setFormState({ ...formState, title: e.target.value })
            }}
          />
          <TextInput
            label="Location"
            name="location"
            value={formState.location}
            onChange={e => {
              setFormState({ ...formState, location: e.target.value })
            }}
          />
          <DateTimeInput
            label="From"
            name="from"
            value={formState.from}
            onChange={(e, from) => {
              setFormState({ ...formState, from })
            }}
          />
          {!!formState.to && (
            <DateTimeInput
              label="To"
              name="to"
              value={formState.to}
              onChange={(e, to) => {
                setFormState({ ...formState, to })
              }}
            />
          )}
          <TextInput
            label="URL"
            name="url"
            type="url"
            value={formState.url}
            onChange={e => {
              setFormState({ ...formState, url: e.target.value })
            }}
          />
          {error && <ErrorMessage>error</ErrorMessage>}
          <VeryFancyButton type="submit">Import Event</VeryFancyButton>
        </Form>
      )
    },
    {
      role: "IMPORT_EVENT",
    }
  )
)
