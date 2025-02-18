import { service_provider } from '#lib/index.js'
import Counter from './Counter.js'
import Fake from './Fake.js'

export default service_provider({
  name: 'counter',
  class: Counter,
  fake: Fake,
})
