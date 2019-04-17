const config = require("@dk3/config")

const { renderDoubleOptInMail } = require("./emails/doubleOptInMail")
const { renderPasswordResetMail } = require("./emails/passwordResetMail")

exports.sendDoubleOptInMail = async user => {
  const emailContents = renderDoubleOptInMail(user)

  try {
    await exports.sendEmail(user.email, emailContents)
  } catch (err) {
    throw err
  }
}

exports.sendPasswordResetMail = async user => {
  const emailContents = renderPasswordResetMail(user)

  try {
    await exports.sendEmail(user.email, emailContents)
  } catch (err) {
    throw err
  }
}

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
