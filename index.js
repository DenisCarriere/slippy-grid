const turfBBox = require('@turf/bbox')
const {hash, range, lngLatToTile} = require('global-mercator')
const {featureEach} = require('@turf/meta')

/**
 * Creates an Iterator of Tiles from a given BBox
 *
 * @param {BBox|BBox[]|GeoJSON} extent BBox [west, south, east, north] order or GeoJSON Polygon
 * @param {number} minZoom Minimum Zoom
 * @param {number} maxZoom Maximum Zoom
 * @returns {Iterator<Tile>} Iterable Grid of Tiles from extent
 * @example
 * const grid = slippyGrid.single([-180.0, -90.0, 180, 90], 3, 8)
 * const {value, done} = grid.next()
 * //=value [x, y, z]
 * //=done true/false
 */
function * single (extent, minZoom, maxZoom) {
  const unique = {}
  for (const [columns, rows, zoom] of levels(extent, minZoom, maxZoom)) {
    for (const row of rows) {
      for (const column of columns) {
        const tile = [column, row, zoom]
        const key = hash(tile)

        // Only return unique key
        if (!unique[key]) {
          unique[key] = true
          yield tile
        }
      }
    }
  }
}

/**
 * All Tiles from a given BBox
 *
 * @param {BBox|BBox[]|GeoJSON} extent BBox [west, south, east, north] order or GeoJSON Polygon
 * @param {number} minZoom Minimum Zoom
 * @param {number} maxZoom Maximum Zoom
 * @returns {Array<Tile>} Tiles from extent
 * @example
 * const tiles = slippyGrid.all([-180.0, -90.0, 180, 90], 3, 8)
 * //=tiles
 */
function all (extent, minZoom, maxZoom) {
  const tiles = []
  const grid = single(extent, minZoom, maxZoom)
  while (true) {
    const {value, done} = grid.next()
    if (done) break
    tiles.push(value)
  }
  return tiles
}

/**
 * Creates a bulk Iterator of Tiles from a given BBox
 *
 * @param {BBox|BBox[]|GeoJSON} extent BBox [west, south, east, north] order or GeoJSON Polygon
 * @param {number} minZoom Minimum Zoom
 * @param {number} maxZoom Maximum Zoom
 * @param {number} size Maximum size for bulk Tiles
 * @returns {Iterator<Tile[]>} Bulk Iterable Grid of Tiles from extent
 * @example
 * const grid = slippyGrid.bulk([-180.0, -90.0, 180, 90], 3, 8, 5000)
 * const {value, done} = grid.next()
 * //=value Array<[x, y, z]>
 * //=done true/false
 */
function * bulk (extent, minZoom, maxZoom, size) {
  const iterable = single(extent, minZoom, maxZoom)
  let container = []
  let i = 0
  while (true) {
    i++
    const { value, done } = iterable.next()
    if (value) {
      container.push(value)
    }
    if (i % size === 0) {
      yield container
      container = []
    }
    if (done) {
      yield container
      break
    }
  }
}

/**
 * Creates a grid level pattern of arrays
 *
 * @param {BBox|BBox[]|GeoJSON} extent BBox [west, south, east, north] order or GeoJSON Polygon
 * @param {number} minZoom Minimum Zoom
 * @param {number} maxZoom Maximum Zoom
 * @returns {GridLevel[]} Grid Level
 * @example
 * const levels = slippyGrid.levels([-180.0, -90.0, 180, 90], 3, 8)
 * //=levels
 */
function levels (extent, minZoom, maxZoom) {
  const extents = []
  if (extent === undefined) throw new Error('extent is required')
  if (minZoom === undefined) throw new Error('minZoom is required')
  if (maxZoom === undefined) throw new Error('maxZoom is required')

  // Single Array
  if (extent.length === 4 && extent[0][0] === undefined) { extents.push({bbox: extent, minZoom, maxZoom}) }

  // Multiple Array
  if (extent.length && extent[0][0] !== undefined) { extent.map(inner => extents.push({bbox: inner, minZoom, maxZoom})) }

  // GeoJSON
  featureEach(extent, feature => {
    const bbox = turfBBox(feature)
    const featureMinZoom = feature.properties.minZoom || feature.properties.minzoom || minZoom
    const featureMaxZoom = feature.properties.maxZoom || feature.properties.maxzoom || maxZoom
    extents.push({bbox, minZoom: featureMinZoom, maxZoom: featureMaxZoom})
  })
  const levels = []
  for (const {bbox, minZoom, maxZoom} of extents) {
    let [x1, y1, x2, y2] = bbox
    for (const zoom of range(minZoom, maxZoom + 1)) {
      if (y2 > 85) y2 = 85
      if (y2 < -85) y2 = -85
      const t1 = lngLatToTile([x1, y1], zoom)
      const t2 = lngLatToTile([x2, y2], zoom)

      // Columns
      let columns = []
      // Fiji - World divided into two parts
      if (t1[0] > t2[0]) {
        // right world +180 degrees
        const maxtx = Math.pow(2, zoom) - 1
        const rightColumns = range(t1[0], maxtx + 1)
        rightColumns.forEach(column => columns.push(column))

        // left world -180 degrees
        const mintx = 0
        const leftColumns = range(mintx, t2[0] + 1)
        leftColumns.forEach(column => columns.push(column))
      } else {
        // Normal World
        const mintx = Math.min(t1[0], t2[0])
        const maxtx = Math.max(t1[0], t2[0])
        columns = range(mintx, maxtx + 1)
      }

      // Rows
      const minty = Math.min(t1[1], t2[1])
      const maxty = Math.max(t1[1], t2[1])
      const rows = range(minty, maxty + 1)

      levels.push([columns, rows, zoom])
    }
  }
  return levels
}

/**
 * Counts the total amount of tiles from a given BBox
 *
 * @param {BBox|BBox[]|GeoJSON} extent BBox [west, south, east, north] order or GeoJSON Polygon
 * @param {number} minZoom Minimum Zoom
 * @param {number} maxZoom Maximum Zoom
 * @param {number} [quick=1000] Enable quick count if greater than number
 * @returns {number} Total tiles from BBox
 * @example
 * const count = slippyGrid.count([-180.0, -90.0, 180, 90], 3, 8)
 * //=count 563136
 */
function count (extent, minZoom, maxZoom, quick) {
  quick = quick || 1000
  let count = 0

  // Quick count
  if (quick !== -1) {
    for (const [columns, rows] of levels(extent, minZoom, maxZoom)) {
      count += rows.length * columns.length
    }
    if (count > quick) { return count }
  }

  // Accurate count
  count = 0
  const grid = single(extent, minZoom, maxZoom)
  while (true) {
    const {done} = grid.next()
    if (done) { break }
    count++
  }
  return count
}
module.exports = {single, bulk, levels, count, all}
