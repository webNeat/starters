import emitter from '@adonisjs/core/services/emitter'
import { InferEvents } from '#lib/index.js'
import * as events from '#app/events/index.js'

/**
 * TODO: add a library function `bind_events` to be able to do:
 * bind_events(emitter, events)
 * instead of doing:
 * emitter.on('collection1:event1', events.collection1.event1)
 * emitter.on('collection1:event2', events.collection1.event2)
 * ...
 */
emitter.on('user:created', events.user.created)
emitter.on('user:confirmed_email', events.user.confirmed_email)

emitter.onError((event, error, eventData) => {
  // TODO: handle errors on events
})

declare module '@adonisjs/core/types' {
  interface EventsList extends InferEvents<typeof events> {}
}
