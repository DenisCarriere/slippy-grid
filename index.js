import {lngLatToTile, hash, range} from 'global-mercator'

/**
 * Creates an Iterator of Tiles from a given BBox
 *
 * @param {BBox|BBox[]} extent BBox [west, south, east, north] order
 * @param {number} minZoom Minimum Zoom
 * @param {number} maxZoom Maximum Zoom
 * @returns {Iterator<Tile>} Iterable Tiles from BBox
 * @example
 * const iterable = single([-180.0, -90.0, 180, 90], 3, 8)
 * const {value, done} = iterable.next()
 * //=value
 * //=done
 */
export function * single (extent, minZoom, maxZoom) {
  const unique = {}

  for (const [columns, rows, zoom] of levels(extent, minZoom, maxZoom)) {
    for (const row of rows) {
      for (const column of columns) {
        const tile = [column, row, zoom]
        const key = hash(tile)
        if (!unique[key]) {
          unique[key] = true
          yield tile
        }
      }
    }
  }
}

/**
 * Creates a bulk Iterator of Tiles from a given BBox
 *
 * @param {BBox|BBox[]} extent BBox [west, south, east, north] order
 * @param {number} minZoom Minimum Zoom
 * @param {number} maxZoom Maximum Zoom
 * @param {number} size Maximum size for bulk Tiles
 * @returns {Iterator<Tile[]>} Bulk iterable Tiles from BBox
 * @example
 * const grid = bulk([-180.0, -90.0, 180, 90], 3, 8, 5000)
 * const {value, done} = grid.next()
 * //=value
 * //=done
 */
export function * bulk (extent, minZoom, maxZoom, size) {
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
 * @param {BBox|BBox[]} extent BBox [west, south, east, north] order
 * @param {number} minZoom Minimum Zoom
 * @param {number} maxZoom Maximum Zoom
 * @returns {GridLevel[]} Grid Level
 * @example
 * const levels = levels([-180.0, -90.0, 180, 90], 3, 8)
 * //=levels
 */
export function levels (extent, minZoom, maxZoom) {
  const levels = []
  for (const bbox of (extent[0][0]) ? extent : [extent]) {
    const [x1, y1, x2, y2] = bbox
    for (const zoom of range(minZoom, maxZoom + 1)) {
      const t1 = lngLatToTile([x1, y1], zoom)
      const t2 = lngLatToTile([x2, y2], zoom)
      const minty = Math.min(t1[1], t2[1])
      const maxty = Math.max(t1[1], t2[1])
      const mintx = Math.min(t1[0], t2[0])
      const maxtx = Math.max(t1[0], t2[0])
      const rows = range(minty, maxty + 1)
      const columns = range(mintx, maxtx + 1)
      levels.push([columns, rows, zoom])
    }
  }
  return levels
}

/**
 * Counts the total amount of tiles from a given BBox
 *
 * @param {BBox|BBox[]} extent BBox [west, south, east, north] order
 * @param {number} minZoom Minimum Zoom
 * @param {number} maxZoom Maximum Zoom
 * @returns {number} Total tiles from BBox
 * @example
 * count([-180.0, -90.0, 180, 90], 3, 8)
 * //=563136
 */
export function count (extent, minZoom, maxZoom) {
  let count = 0
  for (const [columns, rows] of levels(extent, minZoom, maxZoom)) {
    count += rows.length * columns.length
  }
  return count
}
