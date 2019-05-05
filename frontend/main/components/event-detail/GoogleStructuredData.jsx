import React from "react"

export default function GoogleStructuredData(props) {
  const {
    name,
    description,
    startDate,
    url,
    locationName,
    locationAddress,
  } = props

  const content = JSON.stringify({
    "@context": "http://schema.org",
    "@type": "Event",
    name,
    description,
    startDate: startDate.toISOString(),
    url,
    location: {
      "@type": "Place",
      name: locationName,
      address: locationAddress,
    },
  })

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    />
  )
}
