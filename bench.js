const Benchmark = require('benchmark')
const load = require('load-json-file')
const turf = require('@turf/turf')
const slippyGrid = require('./')

const featureCollection = load.sync('./test/in/featureCollection.geojson')
const polygon = load.sync('./test/in/polygon.geojson')
const minZoom = 0
const maxZoom = 5
const bbox = turf.bbox(featureCollection)
const bulk = 5
const suite = new Benchmark.Suite('slippy-grid')
suite
  .add('single', () => slippyGrid.single(bbox, minZoom, maxZoom))
  .add('single featureCollection', () => slippyGrid.single(featureCollection, minZoom, maxZoom))
  .add('single polygon', () => slippyGrid.single(polygon, minZoom, maxZoom))
  .add('bulk', () => slippyGrid.bulk(bbox, minZoom, maxZoom, bulk))
  .add('levels', () => slippyGrid.levels(bbox, minZoom, maxZoom))
  .add('quickCount', () => slippyGrid.count(bbox, minZoom, maxZoom, 1000))
  .add('quickCount max 20', () => slippyGrid.count(bbox, minZoom, 20, 1000))
  .add('count', () => slippyGrid.count(bbox, minZoom, maxZoom))
  .add('count polygon max 5', () => slippyGrid.count(polygon, minZoom, maxZoom))
  .add('count polygon max 20', () => slippyGrid.count(polygon, minZoom, 20))
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run()
