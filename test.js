const fs = require('fs')
const test = require('tape')
const path = require('path')
const load = require('load-json-file')
const mercator = require('global-mercator')
const write = require('write-json-file')
const { featureEach } = require('@turf/meta')
const { featureCollection } = require('@turf/helpers')
const bboxPolygon = require('@turf/bbox-polygon')
const slippyGrid = require('.')

const directories = {
  in: path.join(__dirname, 'test', 'in') + path.sep,
  out: path.join(__dirname, 'test', 'out') + path.sep
}

let fixtures = []
for (const filename of fs.readdirSync(directories.in)) {
  const fixture = {
    name: path.parse(filename).name,
    filename: filename,
    geojson: load.sync(directories.in + filename)
  }
  fixtures.push(fixture)
}

const FIJI = load.sync(path.join(__dirname, 'test', 'in', 'fiji.geojson'))
const WORLD = [-180.0, -90.0, 180, 90]

test('slippy-grid', t => {
  for (const {geojson, filename, name} of fixtures) {
    const results = featureCollection([])
    const grid = slippyGrid.geojson(geojson, 4, 6)
    while (true) {
      const {value, done} = grid.next()
      if (done) break
      const tile = value
      const bbox = mercator.tileToBBox(tile)
      const polygon = bboxPolygon(bbox)
      polygon.properties = {
        'fill-opacity': 0.2,
        x: tile[0],
        y: tile[1],
        z: tile[2],
        bbox
      }
      results.features.push(polygon)
    }
    featureEach(geojson, feature => {
      feature.properties['fill-opacity'] = 0.2
      feature.properties['stroke'] = '#0000ff'
      feature.properties['stroke-width'] = 3
      results.features.push(feature)
    })
    if (process.env.REGEN) write.sync(directories.out + filename, results)
    t.deepEqual(results, load.sync(directories.out + filename), name)
  }
  t.end()
})

test('single', t => {
  const grid = slippyGrid.single(WORLD, 3, 21)
  t.deepEqual(grid.next().value, [0, 0, 3])
  t.end()
})

test('bulk', t => {
  const grid = slippyGrid.bulk(WORLD, 3, 5, 5)
  const { value } = grid.next()
  t.equal(typeof value, typeof [])
  t.end()
})

// test('multiple bbox', t => {
//   const grid = slippyGrid.single([[-20.0, -20.0, 20, 20], [-15.0, -10.0, 10, 10]], 1, 5)
//   let count = 0
//   while (true) {
//     const { done } = grid.next()
//     if (done) { break }
//     count++
//   }
//   t.equal(count, 32)
//   t.end()
// })

// test('single - multiple bbox', t => {
//   const grid = slippyGrid.bulk([[-20.0, -20.0, 20, 20], [-15.0, -10.0, 10, 10]], 1, 5, 500)
//   const { value } = grid.next()
//   t.equal(value.length, 32)
//   t.end()
// })

test('count', t => {
  t.equal(slippyGrid.count(WORLD, 3, 21), 5844858641728)
  t.end()
})

test('levels', t => {
  t.equal(slippyGrid.levels(WORLD, 3, 21).length, 19)
  t.deepEqual(slippyGrid.levels(WORLD, 1, 1), [[[0, 1], [0, 1], 1]])
  t.end()
})

test('fiji', t => {
  const tiles = slippyGrid.all(FIJI, 2, 2)
  t.deepEqual(tiles, [[ 3, 2, 2 ], [ 0, 1, 2 ]])
  const count = slippyGrid.count(FIJI, 0, 10)
  t.equal(count, 326)
  t.end()
})

test('geojson', t => {
  const grid = slippyGrid.geojson(FIJI, 2, 10)
  let count = 0
  while (true) {
    const {done} = grid.next()
    if (done) break
    count++
  }
  t.equal(count, 326)
  t.end()
})

test('getChildren', t => {
  const parentTile = [0, 572, 10]
  const maxZoom = 12
  const grid = slippyGrid.getChildren(parentTile, maxZoom)
  let count = 0
  while (true) {
    const {done} = grid.next()
    if (done) break
    count++
  }
  t.equal(count, 20)
  t.end()
})
