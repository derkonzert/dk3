import { useEffect } from "react"
import { withRouter } from "next/router"

export default withRouter(function Mine({ router }) {
  useEffect(() => {
    router.push("/?showMine=true", "/")
  }, [])

  return <div>{"Hold tight. You're being redirected."}</div>
})
