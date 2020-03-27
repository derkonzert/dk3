import { SentryErrorBoundary } from "../components/SentryErrorBoundary"
import { ArchiveList } from "../components/archive-list/ArchiveList"

export default function Archive() {
  return (
    <SentryErrorBoundary>
      <ArchiveList />
    </SentryErrorBoundary>
  )
}
