import { ListAndDetail, ListAndDetailMain } from "@dk3/ui/layouts/ListAndDetail"

import { EventList } from "../components/list/EventList"
import { WhoAmI } from "../components/WhoAmI"
import { CreateEventForm } from "../components/form/CreateEventForm"

export default function Index() {
  return (
    <ListAndDetail>
      <ListAndDetailMain>
        <WhoAmI />
        <CreateEventForm />
        <EventList />
      </ListAndDetailMain>
    </ListAndDetail>
  )
}
