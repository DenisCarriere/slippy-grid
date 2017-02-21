const path = require('path')
const load = require('load-json-file')
const write = require('write-json-file')
const mercator = require('global-mercator')
const turf = require('@turf/turf')
const slippyGrid = require('../')
const geojson = load.sync(path.join(__dirname, 'in', 'multipleFeatureCollection.geojson'))

const collection = turf.featureCollection([])
const grid = slippyGrid.single(geojson, 1, 8)
let count = 0
while (true) {
  const {value, done} = grid.next()
  if (done) { break }
  const tile = value
  const polygon = turf.bboxPolygon(mercator.tileToBBox(tile))
  polygon.properties['fill-opacity'] = 0
  collection.features.push(polygon)
  count++
}

write.sync(path.join(__dirname, 'results.geojson'), collection)
console.log('count', count)
console.log(slippyGrid.count(geojson, 1, 5))
