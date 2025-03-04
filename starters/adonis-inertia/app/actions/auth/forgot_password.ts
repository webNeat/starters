import vine from '@vinejs/vine'
import { User } from '#app/models/index.js'
import { action, inertia } from '#lib/index.js'
import { urls } from '#inertia/urls.js'
import { send_email } from '#app/functions/index.js'

export const page = action({
  async handle({ ctx }) {
    return inertia('forgot-password', { state: 'form' })
  },
})

export const submit = action({
  body: vine.object({
    email: vine.string().email().normalizeEmail(),
  }),

  async handle({ ctx, body }) {
    const user = await User.findBy('email', body.email)
    if (user) {
      await send_email.reset_password(user)
    }
    return inertia('forgot-password', { state: 'sent' })
  },
})
