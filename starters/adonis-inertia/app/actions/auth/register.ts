import vine from '@vinejs/vine'
import { User } from '#app/models/index.js'
import { action, inertia } from '#lib/index.js'
import { urls } from '#inertia/urls.js'
import emitter from '@adonisjs/core/services/emitter'

export const page = action({
  async handle({ ctx }) {
    if (await ctx.auth.use('web').check()) {
      return ctx.response.redirect(urls.account.uri())
    }
    return inertia('register', {})
  },
})

export const submit = action({
  body: vine.object({
    email: vine.string().email().normalizeEmail().unique({
      table: 'users',
      column: 'email',
    }),
    password: vine.string().minLength(8),
    password_confirmation: vine.string().confirmed({ confirmationField: 'password' }),
  }),

  async handle({ ctx, body }) {
    const user = await User.create({
      email: body.email,
      password: body.password,
      isEmailConfirmed: false,
    })
    await emitter.emit('user:created', { user })
    await ctx.auth.use('web').login(user, true)
    return ctx.response.redirect(urls.account.uri())
  },
})
