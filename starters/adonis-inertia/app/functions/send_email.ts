import mail from '@adonisjs/mail/services/main'
import string from '@adonisjs/core/helpers/string'
import env from '#start/env.js'
import emails from '#emails/index.js'
import { urls } from '#inertia/urls.js'
import { User, UserSecret } from '#app/models/index.js'
import { EmailRenderResult } from '#lib/react_emails.js'

export async function welcome(user: User) {
  const secret = await UserSecret.create({ userId: user.id, value: string.random(48) })
  const confirmation_url = env.get('CLIENT_URL') + urls.confirm_email.uri({ key: secret.value })
  await send(user, emails.welcome({ confirmation_url }))
}

export async function email_confirmed(user: User) {
  await send(user, emails.email_confirmed({}))
}

export async function reset_password(user: User) {
  const secret = await UserSecret.create({ userId: user.id, value: string.random(48) })
  const reset_password_url = env.get('CLIENT_URL') + urls.reset_password.uri({ key: secret.value })
  await send(user, emails.reset_password({ reset_password_url }))
}

async function send(user: User, email: Promise<EmailRenderResult>) {
  const { subject, html, text } = await email
  return mail.send((message) => {
    message.from(env.get('FROM_EMAIL'), env.get('FROM_NAME')).to(user.email).subject(subject).html(html).text(text)
  })
}
