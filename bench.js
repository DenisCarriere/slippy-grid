const Benchmark = require('benchmark')
const slippyGrid = require('.')

const minZoom = 0
const maxZoom = 5
const bbox = [-180.0, -90.0, 180, 90]
const bulk = 5
const suite = new Benchmark.Suite('slippy-grid')
suite
  .add('single', () => {
    const iterable = slippyGrid.single(bbox, minZoom, maxZoom)
    while (true) {
      const {done} = iterable.next()
      if (done) { break }
    }
  })
  .add('bulk', () => {
    const iterable = slippyGrid.bulk(bbox, minZoom, maxZoom, bulk)
    while (true) {
      const {done} = iterable.next()
      if (done) { break }
    }
  })
  .add('levels', () => { slippyGrid.levels(bbox, minZoom, maxZoom) })
  .add('count', () => { slippyGrid.count(bbox, minZoom, maxZoom) })
  .add('count max 20', () => { slippyGrid.count(bbox, minZoom, 20) })
  .on('cycle', (event) => { console.log(String(event.target)) })
  .on('complete', () => {})
  .run()
