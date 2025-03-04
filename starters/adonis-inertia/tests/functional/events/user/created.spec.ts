import { test } from '@japa/runner'
import env from '#start/env.js'
import * as events from '#app/events/index.js'
import { UserFactory } from '#database/factories/index.js'
import emails from '#emails/index.js'
import { urls } from '#inertia/urls.js'
import { expect_email_sent } from '#lib/tests.js'

test.group('event user:created', () => {
  test('sends the welcome email with confirmation link', async ({ client }) => {
    const user = await UserFactory.create()
    await events.user.created({ user })

    const secret = await user.related('secrets').query().firstOrFail()
    const confirmation_url = env.get('CLIENT_URL') + urls.confirm_email.uri({ key: secret.value })
    expect_email_sent(user.email, await emails.welcome({ confirmation_url }))
  })
})
