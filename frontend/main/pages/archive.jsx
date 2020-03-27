import { SentryErrorBoundary } from "../lib/SentryErrorBoundary"
import { ArchiveList } from "../components/archive-list/ArchiveList"

export default function Archive() {
  return (
    <SentryErrorBoundary>
      <ArchiveList />
    </SentryErrorBoundary>
  )
}
