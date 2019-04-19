const { url } = require("@dk3/config")

const html = (user, { addedEvents }) => `<h1>Your derkonzert news,</h1>
<p>new content is available!</p>
<ul>
  ${addedEvents
    .map(
      event => `
    <li>${event.title}</li>
  `
    )
    .join("")}
</ul>
<p>
Check out the full list at <a href="${url("/")}">derkonzert.de</a>!<br />
<br />
Until next time,<br />
Bye
</p>
`

const text = (user, { addedEvents }) => `Your derkonzert news:

${addedEvents.map(event => `${event.title}`).join("\n")}

See the entire list at ${url("/")}

Until next time,
Bye
`

const subject = (user, { addedEvents }) =>
  `${addedEvents.length} new ${
    addedEvents.length === 1 ? "event" : "events"
  } on derkonzert`

exports.renderEventNotificationMail = (user, data) => ({
  html: html(user, data),
  text: text(user, data),
  subject: subject(user, data),
})
