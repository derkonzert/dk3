import { ListAndDetail, ListAndDetailMain } from "@dk3/ui/layouts/ListAndDetail"

import { EventList } from "../components/list/EventList"
import { WhoAmI } from "../components/WhoAmI"
import { CreateEventForm } from "../components/form/CreateEventForm"
import { LoginForm } from "../components/form/LoginForm"

export default function Index() {
  return (
    <ListAndDetail>
      <ListAndDetailMain>
        <WhoAmI />
        <LoginForm />
        <CreateEventForm />
        <EventList />
      </ListAndDetailMain>
    </ListAndDetail>
  )
}
