import { ListAndDetail, ListAndDetailMain } from "@dk3/ui/layouts/ListAndDetail"

import { EventList } from "../components/EventList"
import { WhoAmI } from "../components/WhoAmI"

export default function Index() {
  return (
    <ListAndDetail>
      <ListAndDetailMain>
        <WhoAmI />
        <EventList />
      </ListAndDetailMain>
    </ListAndDetail>
  )
}
