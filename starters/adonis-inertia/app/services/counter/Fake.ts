import Counter from './Counter.js'

export default class Fake extends Counter {
  constructor() {
    super({ initialValue: 0 })
  }
  set(value: number) {
    this.value = value
  }
}
