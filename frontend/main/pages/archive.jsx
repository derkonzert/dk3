import { SentryErrorBoundary } from "@dk3/shared-frontend/lib/SentryErrorBoundary"
import { ArchiveList } from "../components/archive-list/ArchiveList"

export default function Archive() {
  return (
    <SentryErrorBoundary>
      <ArchiveList />
    </SentryErrorBoundary>
  )
}
