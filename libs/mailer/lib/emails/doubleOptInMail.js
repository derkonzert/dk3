const { url } = require("@dk3/config")

const html = user => `<h1>Hey ${user.username},</h1>
<p>please visit the following link to <em>verify your email address</em>:
<br />
<br />
<a href="${url(
  `/account/signup/activate?token=${user.emailVerificationToken}`
)}">
${url(`/account/signup/activate?token=${user.emailVerificationToken}`)}
</a>
<br />
Thanks
</p>
`

const text = user => `Hey ${
  user.username
}, please visit the following link to verify your email address:

${url(`/account/signup/activate?token=${user.emailVerificationToken}`)}

Thanks
`

const subject = () => "E-Mail verification for derkonzert"

exports.renderDoubleOptInMail = user => ({
  html: html(user),
  text: text(user),
  subject: subject(user),
})
