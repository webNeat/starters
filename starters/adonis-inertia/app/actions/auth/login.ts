import vine from '@vinejs/vine'
import { User } from '#app/models/index.js'
import { action, inertia } from '#lib/index.js'
import { urls } from '#inertia/urls.js'

export const page = action({
  async handle({ ctx }) {
    if (await ctx.auth.use('web').check()) {
      return ctx.response.redirect(urls.account.uri())
    }
    return inertia('login', {})
  },
})

export const submit = action({
  body: vine.object({
    email: vine.string().email(),
    password: vine.string(),
  }),

  async handle({ ctx, body }) {
    const user = await User.verifyCredentials(body.email, body.password)
    await ctx.auth.use('web').login(user, true)
    return ctx.response.redirect(urls.account.uri())
  },
})
