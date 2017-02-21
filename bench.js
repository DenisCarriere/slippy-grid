const Benchmark = require('benchmark')
const load = require('load-json-file')
const turf = require('@turf/turf')
const slippyGrid = require('./')

const geojson = load.sync('./test/in/featureCollection.geojson')
const minZoom = 0
const maxZoom = 5
const bbox = turf.bbox(geojson)
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
  .add('single geojson', () => {
    const iterable = slippyGrid.single(geojson, minZoom, maxZoom)
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
  .add('quickCount', () => { slippyGrid.count(bbox, minZoom, maxZoom, true) })
  .add('quickCount max 20', () => { slippyGrid.count(bbox, minZoom, 20, true) })
  .add('count', () => { slippyGrid.count(bbox, minZoom, maxZoom) })
  .add('count geojson', () => { slippyGrid.count(geojson, minZoom, maxZoom) })
  .add('count max 20', () => { slippyGrid.count(bbox, minZoom, 20) })
  .on('cycle', (event) => { console.log(String(event.target)) })
  .on('complete', () => {})
  .run()
