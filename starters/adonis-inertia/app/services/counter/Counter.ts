import { Config } from './types.js'

export default class Counter {
  protected value: number
  constructor(config: Config) {
    this.value = config.initialValue
  }
  get() {
    return this.value
  }
  increment() {
    this.value++
  }
  decrement() {
    this.value--
  }
}
