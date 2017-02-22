/**
 * Iterate over coordinates in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @name coordEach
 * @param {Object} layer any GeoJSON object
 * @param {Function} callback a method that takes (value)
 * @param {boolean=} excludeWrapCoord whether or not to include
 * the final coordinate of LinearRings that wraps the ring in its iteration.
 * @example
 * var point = { type: 'Point', coordinates: [0, 0] };
 * turfMeta.coordEach(point, function(coords) {
 *   // coords is equal to [0, 0]
 * });
 */
export function coordEach (layer, callback, excludeWrapCoord) {
  let i
  let j
  let k
  let g
  let l
  let geometry
  let stopG
  let coords
  let geometryMaybeCollection
  let wrapShrink = 0
  let isGeometryCollection
  let isFeatureCollection = layer.type === 'FeatureCollection'
  let isFeature = layer.type === 'Feature'
  let stop = isFeatureCollection ? layer.features.length : 1

  // This logic may look a little weird. The reason why it is that way
  // is because it's trying to be fast. GeoJSON supports multiple kinds
  // of objects at its root: FeatureCollection, Features, Geometries.
  // This function has the responsibility of handling all of them, and that
  // means that some of the `for` loops you see below actually just don't apply
  // to certain inputs. For instance, if you give this just a
  // Point geometry, then both loops are short-circuited and all we do
  // is gradually rename the input until it's called 'geometry'.
  //
  // This also aims to allocate as few resources as possible: just a
  // few numbers and booleans, rather than any temporary arrays as would
  // be required with the normalization approach.
  for (i = 0; i < stop; i++) {
    geometryMaybeCollection = (isFeatureCollection ? layer.features[i].geometry : (isFeature ? layer.geometry : layer))
    isGeometryCollection = geometryMaybeCollection.type === 'GeometryCollection'
    stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1

    for (g = 0; g < stopG; g++) {
      geometry = isGeometryCollection ? geometryMaybeCollection.geometries[g] : geometryMaybeCollection
      coords = geometry.coordinates

      wrapShrink = (excludeWrapCoord &&
        (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon')) ? 1 : 0

      if (geometry.type === 'Point') {
        callback(coords)
      } else if (geometry.type === 'LineString' || geometry.type === 'MultiPoint') {
        for (j = 0; j < coords.length; j++) callback(coords[j])
      } else if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
        for (j = 0; j < coords.length; j++) {
          for (k = 0; k < coords[j].length - wrapShrink; k++) {
            callback(coords[j][k])
          }
        }
      } else if (geometry.type === 'MultiPolygon') {
        for (j = 0; j < coords.length; j++) {
          for (k = 0; k < coords[j].length; k++) {
            for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
              callback(coords[j][k][l])
            }
          }
        }
      } else if (geometry.type === 'GeometryCollection') {
        for (j = 0; j < geometry.geometries.length; j++) {
          coordEach(geometry.geometries[j], callback, excludeWrapCoord)
        }
      } else {
        throw new Error('Unknown Geometry Type')
      }
    }
  }
}

/**
 * Reduce coordinates in any GeoJSON object into a single value,
 * similar to how Array.reduce works. However, in this case we lazily run
 * the reduction, so an array of all coordinates is unnecessary.
 *
 * @name coordReduce
 * @param {Object} layer any GeoJSON object
 * @param {Function} callback a method that takes (memo, value) and returns
 * a new memo
 * @param {*} memo the starting value of memo: can be any type.
 * @param {boolean=} excludeWrapCoord whether or not to include
 * the final coordinate of LinearRings that wraps the ring in its iteration.
 * @returns {*} combined value
 */
export function coordReduce (layer, callback, memo, excludeWrapCoord) {
  coordEach(layer, function (coord) {
    memo = callback(memo, coord)
  }, excludeWrapCoord)
  return memo
}

/**
 * Iterate over property objects in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @name propEach
 * @param {Object} layer any GeoJSON object
 * @param {Function} callback a method that takes (value)
 * @example
 * var point = { type: 'Feature', geometry: null, properties: { foo: 1 } };
 * turfMeta.propEach(point, function(props) {
 *   // props is equal to { foo: 1}
 * });
 */
export function propEach (layer, callback) {
  var i
  switch (layer.type) {
    case 'FeatureCollection':
      for (i = 0; i < layer.features.length; i++) {
        callback(layer.features[i].properties, i)
      }
      break
    case 'Feature':
      callback(layer.properties, 0)
      break
  }
}

/**
 * Reduce properties in any GeoJSON object into a single value,
 * similar to how Array.reduce works. However, in this case we lazily run
 * the reduction, so an array of all properties is unnecessary.
 *
 * @name propReduce
 * @param {Object} layer any GeoJSON object
 * @param {Function} callback a method that takes (memo, coord) and returns
 * a new memo
 * @param {*} memo the starting value of memo: can be any type.
 * @returns {*} combined value
 * @example
 * // an example of an even more advanced function that gives you the
 * // javascript type of each property of every feature
 * function propTypes (layer) {
 *   opts = opts || {}
 *   return turfMeta.propReduce(layer, function (prev, props) {
 *     for (var prop in props) {
 *       if (prev[prop]) continue
 *       prev[prop] = typeof props[prop]
 *     }
 *   }, {})
 * }
 */
export function propReduce (layer, callback, memo) {
  propEach(layer, function (prop, i) {
    memo = callback(memo, prop, i)
  })
  return memo
}

/**
 * Iterate over features in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @name featureEach
 * @param {Object} layer any GeoJSON object
 * @param {Function} callback a method that takes (value)
 * @example
 * var feature = { type: 'Feature', geometry: null, properties: {} };
 * turfMeta.featureEach(feature, function(feature) {
 *   // feature == feature
 * });
 */
export function featureEach (layer, callback) {
  if (layer.type === 'Feature') {
    callback(layer, 0)
  } else if (layer.type === 'FeatureCollection') {
    for (var i = 0; i < layer.features.length; i++) {
      callback(layer.features[i], i)
    }
  }
}

/**
 * Get all coordinates from any GeoJSON object, returning an array of coordinate
 * arrays.
 *
 * @name coordAll
 * @param {Object} layer any GeoJSON object
 * @returns {Array<Array<number>>} coordinate position array
 */
export function coordAll (layer) {
  var coords = []
  coordEach(layer, function (coord) {
    coords.push(coord)
  })
  return coords
}

/**
 * Iterate over each geometry in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @name geomEach
 * @param {Object} layer any GeoJSON object
 * @param {Function} callback a method that takes (value)
 * @example
 * var point = {
 *   type: 'Feature',
 *   geometry: { type: 'Point', coordinates: [0, 0] },
 *   properties: {}
 * };
 * turfMeta.geomEach(point, function(geom) {
 *   // geom is the point geometry
 * });
 */
export function geomEach (layer, callback) {
  let i
  let j
  let g
  let geometry
  let stopG
  let geometryMaybeCollection
  let isGeometryCollection
  let isFeatureCollection = layer.type === 'FeatureCollection'
  let isFeature = layer.type === 'Feature'
  let stop = isFeatureCollection ? layer.features.length : 1

  // This logic may look a little weird. The reason why it is that way
  // is because it's trying to be fast. GeoJSON supports multiple kinds
  // of objects at its root: FeatureCollection, Features, Geometries.
  // This function has the responsibility of handling all of them, and that
  // means that some of the `for` loops you see below actually just don't apply
  // to certain inputs. For instance, if you give this just a
  // Point geometry, then both loops are short-circuited and all we do
  // is gradually rename the input until it's called 'geometry'.
  //
  // This also aims to allocate as few resources as possible: just a
  // few numbers and booleans, rather than any temporary arrays as would
  // be required with the normalization approach.
  for (i = 0; i < stop; i++) {
    geometryMaybeCollection = (isFeatureCollection ? layer.features[i].geometry : (isFeature ? layer.geometry : layer))
    isGeometryCollection = geometryMaybeCollection.type === 'GeometryCollection'
    stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1

    for (g = 0; g < stopG; g++) {
      geometry = isGeometryCollection ? geometryMaybeCollection.geometries[g] : geometryMaybeCollection

      if (geometry.type === 'Point' ||
        geometry.type === 'LineString' ||
        geometry.type === 'MultiPoint' ||
        geometry.type === 'Polygon' ||
        geometry.type === 'MultiLineString' ||
        geometry.type === 'MultiPolygon') {
        callback(geometry)
      } else if (geometry.type === 'GeometryCollection') {
        for (j = 0; j < geometry.geometries.length; j++) {
          callback(geometry.geometries[j])
        }
      } else {
        throw new Error('Unknown Geometry Type')
      }
    }
  }
}