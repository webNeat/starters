import { TestContext } from '@japa/runner/core'
import mail from '@adonisjs/mail/services/main'
import emitter from '@adonisjs/core/services/emitter'
import testUtils from '@adonisjs/core/services/test_utils'
import { ApiResponse } from '@japa/api-client'
import type { PluginFn, SuiteHooksHandler, TestHooksHandler } from '@japa/runner/types'
import { holder } from './helpers.js'
import { InertiaPage, InertiaPages, TestPluginConfig } from './types.js'
import { EventsList } from '@adonisjs/core/types'
import { EmailRenderResult } from './react_emails.js'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'

type Events = ReturnType<typeof emitter.fake>
type Mailer = ReturnType<typeof mail.fake>
type SetupFn = SuiteHooksHandler<TestContext>
type EachSetupFn = TestHooksHandler<TestContext>

declare module '@japa/runner/core' {
  interface TestContext {
    events: Events
    mailer_mails: Mailer['mails']
    mailer_messages: Mailer['messages']
  }
}

declare module '@japa/api-client' {
  interface ApiResponse {
    assertInertiaPage<Page extends InertiaPage>(page: Page, props: InertiaPages[Page]): this
    assertRememberMeCookie(present: boolean): this
  }
}

const test_ctx = holder<TestContext>()

export function tests_plugin({ services }: TestPluginConfig): PluginFn {
  return (ctx) => {
    const setups: SetupFn[] = [() => testUtils.db().migrate()]
    const each_setups: EachSetupFn[] = [() => testUtils.db().truncate()]

    each_setups.push(() => {
      hash.fake()
      return () => hash.restore()
    })

    let events: Events
    TestContext.getter('events', () => events)
    each_setups.push(() => {
      events = emitter.fake()
      return () => emitter.restore()
    })

    let mailer: Mailer
    TestContext.getter('mailer_mails', () => mailer.mails)
    TestContext.getter('mailer_messages', () => mailer.messages)
    each_setups.push(() => {
      mailer = mail.fake()
      return () => mail.restore()
    })

    for (const service of Object.values(services)) {
      each_setups.push(() => {
        service.fake()
        return () => service.restore()
      })
    }

    each_setups.push((t) => {
      test_ctx.set(t.context)
      return () => {
        test_ctx.set(undefined)
      }
    })

    ctx.runner.onSuite((suite) => {
      setups.forEach((fn) => suite.setup(fn))
      suite.onTest((test) => each_setups.forEach((fn) => test.setup(fn)))
      suite.onGroup((group) => each_setups.forEach((fn) => group.each.setup(fn)))
    })
  }
}

ApiResponse.macro('assertInertiaPage', function (this: ApiResponse, page, props) {
  this.assertInertiaComponent(page)
  this.assertInertiaProps(props)
  return this
})

ApiResponse.macro('assertRememberMeCookie', function (this: ApiResponse, present: boolean) {
  const cookie = this.cookie('remember_web')
  if (present && (!cookie || cookie.value === '' || cookie.maxAge === -1)) throw new Error('Remember me cookie is missing!')
  if (!present && cookie && cookie.value != '' && cookie.maxAge && cookie.maxAge > 0) throw new Error('Remember me cookie is present!')
  return this
})

export function inertia_errors_checker(page: InertiaPage, action: string) {
  return async (data: Record<string, any>, errors: Record<string, any>) => {
    const { client } = test_ctx.get()
    const res = await client.post(action).withInertia().withCsrfToken().header('Referer', action).form(data)

    res.assertInertiaComponent(page)
    res.assertInertiaPropsContains({ errors })
    return res
  }
}

export function expect_event<Event extends keyof EventsList>(name: Event, fn: (data: EventsList[Event]) => void) {
  const { events } = test_ctx.get()
  const matching_events = events.all().filter((e) => e.event === name)
  let found = false
  for (const event of matching_events) {
    try {
      fn(event.data)
      found = true
    } catch {}
  }
  if (!found) {
    console.log(`Events ${name}`)
    console.dir(matching_events, { depth: 10 })
    throw new Error(`Event ${name} not found!`)
  }
}

export function expect_email_sent(address: string, { subject, html, text }: EmailRenderResult) {
  const { expect, mailer_messages } = test_ctx.get()
  const messages = mailer_messages.sent().map((m) => m.toObject().message)
  let found = false
  for (const message of messages) {
    try {
      expect(message).toMatchObject({ to: [address], subject, html, text })
      found = true
    } catch {}
    if (found) break
  }
  if (!found) {
    console.log(`Expected an email sent to "${address}" with`, { subject, html, text })
    console.log(`Actual sent messages:`)
    console.dir(messages, { depth: 10 })
    throw new Error(`Expected email not found!`)
  }
}

export function expect_date_close_to(date: DateTime, target: DateTime, margin_ms = 1000) {
  const { expect } = test_ctx.get()
  expect(date.toMillis()).toBeGreaterThan(target.minus({ milliseconds: margin_ms }).toMillis())
  expect(date.toMillis()).toBeLessThan(target.plus({ milliseconds: margin_ms }).toMillis())
}

// export function get_sent_message(mailer_messages: Mailer['messages'], index: number) {
//   const sent = mailer_messages.sent()
//   return sent[index].toObject().message
// }

// export function get_queued_message(mailer_messages: Mailer['messages'], index: number) {
//   const sent = mailer_messages.queued()
//   return sent[index].toObject().message
// }

// export function get_sent_mail(mailer_mails: Mailer['mails'], index: number) {
//   const sent = mailer_mails.sent()
//   return sent[index].message.toObject().message
// }

// export function get_queued_mail(mailer_mails: Mailer['mails'], index: number) {
//   const sent = mailer_mails.queued()
//   return sent[index].message.toObject().message
// }
