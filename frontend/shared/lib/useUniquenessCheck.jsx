import { useRef, useState, useEffect } from "react"
import useDebounce from "react-use/lib/useDebounce"

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const asyncCheck = async (uri, value) => {
  const [response] = await Promise.all([
    fetch(uri, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ check: value }),
    }),
    sleep(500),
  ])

  const json = await response.json()

  return json.isUnique
}

export function useUniquenessCheck(value, uri) {
  const ref = useRef(value)

  const [isUnique, setIsUnique] = useState(undefined)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    if (ref.current !== value) {
      setIsUnique(undefined)
    }
  }, [value])

  useDebounce(
    () => {
      let stillExists = true
      if (ref.current !== value) {
        setIsChecking(true)
        asyncCheck(uri, value).then(result => {
          if (stillExists) {
            setIsUnique(result)
            setIsChecking(false)
          }
        }, [])
      }
      return () => (stillExists = false)
    },
    500,
    [value]
  )

  return [isUnique, isChecking]
}
