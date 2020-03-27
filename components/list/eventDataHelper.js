export const sortEvents = (a, b) => {
  const dateSort = new Date(a.from).getTime() - new Date(b.from).getTime()
  if (dateSort !== 0) {
    return dateSort
  }

  return a.title > b.title ? 1 : -1
}

export const isToday = date => {
  const now = new Date()
  return now.toDateString() === date.toDateString() || date < now
}

export const isTomorrow = date =>
  new Date(Date.now() + 86400000).toDateString() === date.toDateString()

export const groupedEventsArchive = events => {
  return events.reduce((groups, event) => {
    const currentYear = groups[groups.length - 1]
    const eventFrom = new Date(event.from)

    if (!currentYear) {
      groups.push({
        date: eventFrom,
        events: [event],
      })
    } else if (currentYear.date.getMonth() !== eventFrom.getMonth()) {
      groups.push({
        date: eventFrom,
        events: [event],
      })
    } else {
      groups[groups.length - 1].events.push(event)
    }

    return groups
  }, [])
}

export const groupedEvents = events => {
  let lastEventDate
  return events.sort(sortEvents).reduce((groups, event) => {
    const currentMonth = groups[groups.length - 1]
    const eventFrom = new Date(event.from)

    if (!currentMonth) {
      groups.push({
        date: eventFrom,
        isToday: isToday(eventFrom),
        isTomorrow: isTomorrow(eventFrom),
        events: [event],
      })
    } else if (
      (isToday(currentMonth.date) && isToday(eventFrom)) ||
      (isTomorrow(currentMonth.date) && isTomorrow(eventFrom))
    ) {
      groups[groups.length - 1].events.push(event)
    } else if (
      (isToday(lastEventDate) && !isToday(eventFrom)) ||
      (isTomorrow(lastEventDate) && !isTomorrow(eventFrom))
    ) {
      groups.push({
        date: eventFrom,
        isToday: isToday(eventFrom),
        isTomorrow: isTomorrow(eventFrom),
        events: [event],
      })
    } else if (
      !isToday(eventFrom) &&
      !isTomorrow(eventFrom) &&
      currentMonth.date.getMonth() !== eventFrom.getMonth()
    ) {
      groups.push({
        date: eventFrom,
        isToday: isToday(eventFrom),
        isTomorrow: isTomorrow(eventFrom),
        events: [event],
      })
    } else {
      groups[groups.length - 1].events.push(event)
    }

    lastEventDate = eventFrom

    return groups
  }, [])
}
