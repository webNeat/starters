import { test } from '@japa/runner'
import emails from '#emails/index.js'
import * as events from '#app/events/index.js'
import { expect_email_sent } from '#lib/tests.js'
import { UserFactory } from '#database/factories/index.js'

test.group('event user:confirmed_email', () => {
  test('sends the email_confirmed email', async () => {
    const user = await UserFactory.create()
    await events.user.confirmed_email({ user })

    expect_email_sent(user.email, await emails.email_confirmed({}))
  })
})
