const { url } = require("@dk3/config")

const html = user => `<h1>Hey ${user.username},</h1>
<p>you requested a <em>password reset</em> on derkonzert.de. Click the following link to change your password:
<br />
<br />
<a href="${url(`/account/password/reset?token=${user.passwordResetToken}`)}">
${url(`/account/password/reset?token=${user.passwordResetToken}`)}
</a>
<br />
<br />
If you did not request this, please contact us.
<br />
<br />
Have a nice day!
</p>
`

const text = user => `Hey ${
  user.username
}, you requested a password reset on derkonzert.de. Click the following link to change your password:

${url(`/account/password/reset?token=${user.passwordResetToken}`)}

If you did not request this, please contact us.

Have a nice day!
`

const subject = () => "Reset your password on derkonzert.de"

exports.renderPasswordResetMail = user => ({
  html: html(user),
  text: text(user),
  subject: subject(user),
})
