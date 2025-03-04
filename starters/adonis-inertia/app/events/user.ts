import { User } from '#app/models/index.js'
import { send_email } from '#app/functions/index.js'

type Data = {
  user: User
}

export async function created({ user }: Data) {
  await send_email.welcome(user)
}

export async function confirmed_email({ user }: Data) {
  await send_email.email_confirmed(user)
}
