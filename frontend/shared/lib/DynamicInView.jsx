import dynamic from "next/dynamic"

export const DynamicInView = dynamic(
  () =>
    import("react-intersection-observer").then(async mod => {
      if (typeof window.IntersectionObserver === "undefined") {
        await import("intersection-observer")
      }
      return mod.InView
    }),
  { ssr: false }
)
