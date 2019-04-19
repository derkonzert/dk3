const config = require("@dk3/config")

const { renderDoubleOptInMail } = require("./emails/doubleOptInMail")
const { renderPasswordResetMail } = require("./emails/passwordResetMail")
const {
  renderEventNotificationMail,
} = require("./emails/eventNotificationMail")

const createMailSender = renderer => async (user, data) => {
  const contents = renderer(user, data)

  try {
    await exports.sendEmail(user.email, contents)
  } catch (err) {
    throw err
  }
}

exports.sendDoubleOptInMail = createMailSender(renderDoubleOptInMail)

exports.sendPasswordResetMail = createMailSender(renderPasswordResetMail)

exports.sendEventNotificationEmail = createMailSender(
  renderEventNotificationMail
)

exports.sendEmail = async (to, { subject, text, html }) => {
  const apiKey = config.get("SENDGRID_API_KEY", false)

  if (!apiKey) {
    /* TODO: Find a better solution for this… */
    /* eslint-disable no-console */
    console.log(subject)
    console.log("---------------------")
    console.log(text)
    console.log("---------------------")
    console.log(html)
    /* eslint-enable no-console */
    return
  }

  const sgMail = require("@sendgrid/mail")

  sgMail.setApiKey(apiKey)

  const from = config.get("SEND_MAILS_FROM")

  try {
    await sgMail.send({
      to,
      from,
      text,
      html,
      subject,
    })
  } catch (err) {
    throw err
  }
}
