import { Service } from '#lib/types.js'
import type Counter from './Counter.js'
import type Fake from './Fake.js'

export type Config = {
  initialValue: number
}

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    counter: Service<typeof Counter, typeof Fake>
  }
}
