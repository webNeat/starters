import vine from '@vinejs/vine'
import emitter from '@adonisjs/core/services/emitter'
import { action, inertia } from '#lib/index.js'
import { UserSecret } from '#app/models/index.js'
import { DateTime } from 'luxon'

export const page = action({
  query: vine.object({
    key: vine.string(),
  }),
  async handle({ ctx, query }) {
    const secret = await UserSecret.query().where('value', query.key).whereNull('usedAt').firstOrFail()
    const user = await secret.related('user').query().firstOrFail()
    if (!user.isEmailConfirmed) {
      user.isEmailConfirmed = true
      await user.save()
      await emitter.emit('user:confirmed_email', { user })
    }
    secret.usedAt = DateTime.now()
    await Promise.all([secret.save(), ctx.auth.use('web').login(user, true)])
    return inertia('confirm-email', {})
  },
})
