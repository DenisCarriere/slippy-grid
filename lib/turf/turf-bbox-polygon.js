import {polygon} from './turf-helpers'

/**
 * Takes a bbox and returns an equivalent {@link Polygon|polygon}.
 *
 * @name bboxPolygon
 * @param {Array<number>} bbox extent in [minX, minY, maxX, maxY] order
 * @return {Feature<Polygon>} a Polygon representation of the bounding box
 * @example
 * var bbox = [0, 0, 10, 10]
 *
 * var poly = turf.bboxPolygon(bbox)
 *
 * //=poly
 */

export default function (bbox) {
  var lowLeft = [bbox[0], bbox[1]]
  var topLeft = [bbox[0], bbox[3]]
  var topRight = [bbox[2], bbox[3]]
  var lowRight = [bbox[2], bbox[1]]

  return polygon([[
    lowLeft,
    lowRight,
    topRight,
    topLeft,
    lowLeft
  ]])
}
