const fs = require('fs')
const path = require('path')
const load = require('load-json-file')
const mercator = require('global-mercator')
const write = require('write-json-file')
const turf = require('@turf/turf')
const slippyGrid = require('.')

const directories = {
  in: path.join(__dirname, 'test', 'in') + path.sep,
  out: path.join(__dirname, 'test', 'out') + path.sep
}

const fixtures = []
for (const filename of fs.readdirSync(directories.in)) {
  const fixture = {
    name: filename,
    geojson: load.sync(directories.in + filename)
  }
  fixtures.push(fixture)
}

const WORLD = [-180.0, -90.0, 180, 90]

/**
 * Grid
 */
describe('grid', () => {
  test('single', () => {
    const grid = slippyGrid.single(WORLD, 3, 21)
    expect(grid.next().value).toEqual([0, 0, 3])
  })

  for (const fixture of fixtures) {
    const name = fixture.name
    const geojson = fixture.geojson

    test('single ' + name, () => {
      const grid = slippyGrid.single(fixture.geojson, 1, 8)
      const collection = turf.featureCollection([])
      while (true) {
        const {value, done} = grid.next()
        if (done) { break }
        const tile = value
        const polygon = turf.bboxPolygon(mercator.tileToBBox(tile))
        polygon.properties['fill-opacity'] = 0
        collection.features.push(polygon)
      }
      if (geojson.type === 'FeatureCollection') {
        geojson.features.map(feature => collection.features.push(feature))
      }
      if (geojson.type === 'Feature') {
        collection.features.push(geojson)
      }
      if (process.env.REGEN) { write.sync(directories.out + name, collection) }
      expect(collection, load.sync(directories.out + name))
    })
  }

  test('bulk', () => {
    const grid = slippyGrid.bulk(WORLD, 3, 5, 5)
    while (true) {
      const { value, done } = grid.next()
      if (done) { break }
      expect(typeof value).toBe(typeof [])
    }
  })

  test('single - multiple bbox', () => {
    const grid = slippyGrid.single([[-20.0, -20.0, 20, 20], [-15.0, -10.0, 10, 10]], 1, 5)
    let count = 0
    while (true) {
      const { done } = grid.next()
      if (done) { break }
      count++
    }
    expect(count).toBe(32)
  })

  test('bulk - multiple bbox', () => {
    const grid = slippyGrid.bulk([[-20.0, -20.0, 20, 20], [-15.0, -10.0, 10, 10]], 1, 5, 500)
    const { value } = grid.next()
    expect(value.length).toBe(32)
  })

  test('count', () => expect(slippyGrid.count(WORLD, 3, 21)).toBe(37773648480704))
  test('levels', () => expect(slippyGrid.levels(WORLD, 3, 21).length).toBe(19))
})
