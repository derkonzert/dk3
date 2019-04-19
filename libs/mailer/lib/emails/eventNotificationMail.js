const slug = require("slug")
const { url } = require("@dk3/config")
const { DateTime } = require("luxon")

const maxChars = string => string.substr(0, 80)

const prepareEvents = events => {
  let prevDate

  return events.reduce((list, event) => {
    const eventDate = DateTime.fromJSDate(event.from, {
      zone: "Europe/Berlin",
    }).toFormat("dd.MM.yyyy")

    if (!prevDate || prevDate !== eventDate) {
      list.push({
        type: "date",
        value: eventDate,
      })

      prevDate = eventDate
    }

    list.push({
      type: "event",
      url: `/event/${maxChars(
        `${slug(event.title.trim()).toLowerCase()}-${slug(
          event.location.trim()
        ).toLowerCase()}`
      )}-${event.shortId}`,
      value: `${event.title} at ${event.location}`,
    })

    return list
  }, [])
}
const html = (user, { addedEvents }) => `
${renderHTMLStart()}
${prepareEvents(addedEvents)
  .map(item => {
    if (item.type === "date") {
      return `<!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="Margin:0px auto;border-radius:4px;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;border-radius:4px;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:0 0;text-align:center;vertical-align:top;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]--><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:IBM Plex Serif;font-size:14px;line-height:1;text-align:left;color:#636363;">${
        item.value
      }:</div></td></tr></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--> `
    }

    return `<!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="Margin:0px auto;border-radius:4px;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;border-radius:4px;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:0;text-align:center;vertical-align:top;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]--><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;width:100%;line-height:100%;"><tr><td align="center" bgcolor="#ffffff" role="presentation" style="border:none;border-radius:3px;cursor:auto;padding:10px 25px;text-align:left;background:#ffffff;" valign="middle"><a href="${url(
      item.url
    )}" style="background:#ffffff;color:#101010;font-family:IBM Plex Sans;font-size:18px;font-weight:normal;line-height:120%;Margin:0;text-decoration:none;text-transform:none;" target="_blank">${
      item.value
    }</a></td></tr></table></td></tr></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]-->`
  })
  .join("")}
  ${renderHTMLEnd()}
`

const text = (user, { addedEvents }) => `Your derkonzert news:

${addedEvents.map(event => `${event.title} at ${event.location}`).join("\n")}

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

function renderHTMLStart() {
  return `<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title>derkonzert notifications</title><!--[if !mso]><!-- --><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style type="text/css">#outlook a { padding:0; }
  .ReadMsgBody { width:100%; }
  .ExternalClass { width:100%; }
  .ExternalClass * { line-height:100%; }
  body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
  table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
  img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
  p { display:block;margin:13px 0; }</style><!--[if !mso]><!--><style type="text/css">@media only screen and (max-width:480px) {
    @-ms-viewport { width:320px; }
    @viewport { width:320px; }
  }</style><!--<![endif]--><!--[if mso]>
<xml>
<o:OfficeDocumentSettings>
  <o:AllowPNG/>
  <o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
<![endif]--><!--[if lte mso 11]>
<style type="text/css">
  .outlook-group-fix { width:100% !important; }
</style>
<![endif]--><!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css"><link href="http://fonts.googleapis.com/css?family=IBM+Plex+Sans" rel="stylesheet" type="text/css"><link href="http://fonts.googleapis.com/css?family=IBM+Plex+Serif" rel="stylesheet" type="text/css"><style type="text/css">@import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700);
@import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
@import url(http://fonts.googleapis.com/css?family=IBM+Plex+Sans);
@import url(http://fonts.googleapis.com/css?family=IBM+Plex+Serif);</style><!--<![endif]--><style type="text/css">@media only screen and (min-width:480px) {
.mj-column-per-100 { width:100% !important; max-width: 100%; }
}</style><style type="text/css"></style></head><body style="background-color:#f9f9f9;"><div style="background-color:#f9f9f9;"><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]--><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:IBM Plex Serif;font-size:32px;font-weight:bold;line-height:1;text-align:left;color:#000000;">derkonzert</div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:IBM Plex Sans;font-size:18px;line-height:142%;text-align:left;color:#101010;">These are the latest additions to the derkonzert event list:</div></td></tr></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]-->`
}

function renderHTMLEnd() {
  // eslint-disable-next-line quotes
  return `<!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:50px 0 0;text-align:center;vertical-align:top;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]--><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" style="font-size:0px;padding:0 10px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:center;color:#000000;"><p style="Margin:0; padding-bottom:10px; font-size:10px; line-height:15px; Margin-bottom:10px; color:#111111; font-family: 'Open Sans', 'Raleway', Arial, Helvetica, sans-serif;">We only send emails to individuals who have registered at our site: <a href="http://derkonzert.de/" name="footer_dk3homepage" style="color:#111111; text-decoration:underline;">derkonzert.de</a></p><p style="Margin:0; padding-bottom:10px; font-size:10px; line-height:15px; Margin-bottom:10px; color:#111111; font-family: 'Open Sans', 'Raleway', Arial, Helvetica, sans-serif;"><a href="http://derkonzert.de/pages/imprint" name="footer_privacy" style="color:#111111; text-decoration:underline;"><strong>Imprint</strong> </a>&nbsp;&nbsp;|&nbsp;&nbsp; <a href="http://derkonzert.de/pages/privacy" name="footer_privacy" style="color:#111111; text-decoration:underline;"><strong>Privacy</strong> </a>&nbsp;&nbsp;|&nbsp;&nbsp; <a href="http://derkonzert.de/account" style="text-decoration:underline; color:#111111;"><strong>Manage Subscription</strong></a></p></div></td></tr></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></div></body></html>`
}
