import vine from '@vinejs/vine'
import { User, UserSecret } from '#app/models/index.js'
import { action, inertia } from '#lib/index.js'
import { urls } from '#inertia/urls.js'
import { DateTime } from 'luxon'

export const page = action({
  query: vine.object({
    key: vine.string(),
  }),
  async handle({ query }) {
    const secret = await UserSecret.query().where('value', query.key).whereNull('usedAt').firstOrFail()
    await secret.related('user').query().firstOrFail()
    return inertia('reset-password', { key: query.key })
  },
})

export const submit = action({
  query: vine.object({
    key: vine.string(),
  }),
  body: vine.object({
    password: vine.string().minLength(8),
    password_confirmation: vine.string().confirmed({ confirmationField: 'password' }),
  }),
  async handle({ ctx, body, query }) {
    const secret = await UserSecret.query().where('value', query.key).whereNull('usedAt').firstOrFail()
    const user = await secret.related('user').query().firstOrFail()
    user.password = body.password
    secret.usedAt = DateTime.now()
    await Promise.all([user.save(), secret.save()])
    return ctx.response.redirect(urls.login.uri())
  },
})
