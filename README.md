# Slippy Grid

[![Build Status](https://travis-ci.org/DenisCarriere/slippy-grid.svg?branch=master)](https://travis-ci.org/DenisCarriere/slippy-grid)
[![Coverage Status](https://coveralls.io/repos/github/DenisCarriere/slippy-grid/badge.svg?branch=master)](https://coveralls.io/github/DenisCarriere/slippy-grid?branch=master)
[![npm version](https://badge.fury.io/js/slippy-grid.svg)](https://badge.fury.io/js/slippy-grid)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/DenisCarriere/slippy-grid/master/LICENSE)

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

Create slippy tile grid iterators from BBox.

## Install

**npm**

```bash
$ npm install --save slippy-grid
```

**web browser [ES6](https://kangax.github.io/compat-table/es6)**

```html
<script src="https://unpkg.com/slippy-grid/slippy-grid.js"></script>
```

## API

### single

Creates an Iterator of Tiles from a given BBox

**Parameters**

-   `extent` **(BBox | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;BBox> | GeoJSON)** BBox [west, south, east, north] order or GeoJSON Polygon
-   `minZoom` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Minimum Zoom
-   `maxZoom` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Maximum Zoom

**Examples**

```javascript
const grid = slippyGrid.single([-180.0, -90.0, 180, 90], 3, 8)
const {value, done} = grid.next()
//=value [x, y, z]
//=done true/false
```

Returns **Iterator&lt;Tile>** Iterable Grid of Tiles from extent

### bulk

Creates a bulk Iterator of Tiles from a given BBox

**Parameters**

-   `extent` **(BBox | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;BBox> | GeoJSON)** BBox [west, south, east, north] order or GeoJSON Polygon
-   `minZoom` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Minimum Zoom
-   `maxZoom` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Maximum Zoom
-   `size` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Maximum size for bulk Tiles

**Examples**

```javascript
const grid = slippyGrid.bulk([-180.0, -90.0, 180, 90], 3, 8, 5000)
const {value, done} = grid.next()
//=value Array<[x, y, z]>
//=done true/false
```

Returns **Iterator&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;Tile>>** Bulk Iterable Grid of Tiles from extent

### levels

Creates a grid level pattern of arrays

**Parameters**

-   `extent` **(BBox | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;BBox> | GeoJSON)** BBox [west, south, east, north] order or GeoJSON Polygon
-   `minZoom` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Minimum Zoom
-   `maxZoom` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Maximum Zoom

**Examples**

```javascript
const levels = slippyGrid.levels([-180.0, -90.0, 180, 90], 3, 8)
//=levels
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;GridLevel>** Grid Level

### count

Counts the total amount of tiles from a given BBox

**Parameters**

-   `extent` **(BBox | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;BBox> | GeoJSON)** BBox [west, south, east, north] order or GeoJSON Polygon
-   `minZoom` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Minimum Zoom
-   `maxZoom` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Maximum Zoom
-   `quick` **\[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]** Enable quick count if greater than number (optional, default `1000`)

**Examples**

```javascript
const count = slippyGrid.count([-180.0, -90.0, 180, 90], 3, 8)
//=count 563136
```

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Total tiles from BBox

### bbox

Takes a set of features, calculates the bbox of all input features, and returns a bounding box.

**Parameters**

-   `geojson` **(Feature | FeatureCollection)** input features

**Examples**

```javascript
var pt1 = turf.point([114.175329, 22.2524])
var pt2 = turf.point([114.170007, 22.267969])
var pt3 = turf.point([114.200649, 22.274641])
var pt4 = turf.point([114.200649, 22.274641])
var pt5 = turf.point([114.186744, 22.265745])
var features = turf.featureCollection([pt1, pt2, pt3, pt4, pt5])

var bbox = turf.bbox(features)

var bboxPolygon = turf.bboxPolygon(bbox)

//=bbox

//=bboxPolygon
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** bbox extent in [minX, minY, maxX, maxY] order

### coordEach

Iterate over coordinates in any GeoJSON object, similar to
Array.forEach.

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (value)
-   `excludeWrapCoord` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** whether or not to include
    the final coordinate of LinearRings that wraps the ring in its iteration.

**Examples**

```javascript
var point = { type: 'Point', coordinates: [0, 0] };
turfMeta.coordEach(point, function(coords) {
  // coords is equal to [0, 0]
});
```

### coordReduce

Reduce coordinates in any GeoJSON object into a single value,
similar to how Array.reduce works. However, in this case we lazily run
the reduction, so an array of all coordinates is unnecessary.

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (memo, value) and returns
    a new memo
-   `memo` **Any** the starting value of memo: can be any type.
-   `excludeWrapCoord` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** whether or not to include
    the final coordinate of LinearRings that wraps the ring in its iteration.

Returns **Any** combined value

### propEach

Iterate over property objects in any GeoJSON object, similar to
Array.forEach.

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (value)

**Examples**

```javascript
var point = { type: 'Feature', geometry: null, properties: { foo: 1 } };
turfMeta.propEach(point, function(props) {
  // props is equal to { foo: 1}
});
```

### propReduce

Reduce properties in any GeoJSON object into a single value,
similar to how Array.reduce works. However, in this case we lazily run
the reduction, so an array of all properties is unnecessary.

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (memo, coord) and returns
    a new memo
-   `memo` **Any** the starting value of memo: can be any type.

**Examples**

```javascript
// an example of an even more advanced function that gives you the
// javascript type of each property of every feature
function propTypes (layer) {
  opts = opts || {}
  return turfMeta.propReduce(layer, function (prev, props) {
    for (var prop in props) {
      if (prev[prop]) continue
      prev[prop] = typeof props[prop]
    }
  }, {})
}
```

Returns **Any** combined value

### featureEach

Iterate over features in any GeoJSON object, similar to
Array.forEach.

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (value)

**Examples**

```javascript
var feature = { type: 'Feature', geometry: null, properties: {} };
turfMeta.featureEach(feature, function(feature) {
  // feature == feature
});
```

### coordAll

Get all coordinates from any GeoJSON object, returning an array of coordinate
arrays.

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>>** coordinate position array

### geomEach

Iterate over each geometry in any GeoJSON object, similar to
Array.forEach.

**Parameters**

-   `layer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any GeoJSON object
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (value)

**Examples**

```javascript
var point = {
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [0, 0] },
  properties: {}
};
turfMeta.geomEach(point, function(geom) {
  // geom is the point geometry
});
```

### inside

Takes a [Point](Point) and a [Polygon](Polygon) or [MultiPolygon](MultiPolygon) and determines if the point resides inside the polygon. The polygon can
be convex or concave. The function accounts for holes.

**Parameters**

-   `point` **Feature&lt;Point>** input point
-   `polygon` **Feature&lt;(Polygon | MultiPolygon)>** input polygon or multipolygon

**Examples**

```javascript
var pt = turf.point([-77, 44]);
var poly = turf.polygon([[
  [-81, 41],
  [-81, 47],
  [-72, 47],
  [-72, 41],
  [-81, 41]
]]);

var isInside = turf.inside(pt, poly);

//=isInside
```

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** `true` if the Point is inside the Polygon; `false` if the Point is not inside the Polygon

### getCoord

Unwrap a coordinate from a Feature with a Point geometry, a Point
geometry, or a single coordinate.

**Parameters**

-   `obj` **Any** any value

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** a coordinate

### geojsonType

Enforce expectations about types of GeoJSON objects for Turf.

**Parameters**

-   `value` **GeoJSON** any GeoJSON object
-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** expected GeoJSON type
-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** name of calling function


-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** if value is not the expected type.

### featureOf

Enforce expectations about types of [Feature](Feature) inputs for Turf.
Internally this uses [geojsonType](#geojsontype) to judge geometry types.

**Parameters**

-   `feature` **Feature** a feature with an expected geometry type
-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** expected GeoJSON type
-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** name of calling function


-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** error if value is not the expected type.

### collectionOf

Enforce expectations about types of [FeatureCollection](FeatureCollection) inputs for Turf.
Internally this uses [geojsonType](#geojsontype) to judge geometry types.

**Parameters**

-   `featurecollection` **FeatureCollection** a featurecollection for which features will be judged
-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** expected GeoJSON type
-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** name of calling function


-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** if value is not the expected type.

### bboxPolygon

Takes a bbox and returns an equivalent [polygon](Polygon).

**Parameters**

-   `bbox` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** extent in [minX, minY, maxX, maxY] order

**Examples**

```javascript
var bbox = [0, 0, 10, 10]

var poly = turf.bboxPolygon(bbox)

//=poly
```

Returns **Feature&lt;Polygon>** a Polygon representation of the bounding box

### explode

Takes a feature or set of features and returns all positions as
[points](Point).

**Parameters**

-   `geojson` **(Feature | FeatureCollection)** input features

**Examples**

```javascript
var poly = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [177.434692, -17.77517],
      [177.402076, -17.779093],
      [177.38079, -17.803937],
      [177.40242, -17.826164],
      [177.438468, -17.824857],
      [177.454948, -17.796746],
      [177.434692, -17.77517]
    ]]
  }
};

var points = turf.explode(poly);

//=poly

//=points
```

-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** if it encounters an unknown geometry type

Returns **FeatureCollection&lt;[point](#point)>** points representing the exploded input features

### feature

Wraps a GeoJSON [Geometry](Geometry) in a GeoJSON [Feature](Feature).

**Parameters**

-   `geometry` **Geometry** input geometry
-   `properties` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** properties

**Examples**

```javascript
var geometry = {
     "type": "Point",
     "coordinates": [
       67.5,
       32.84267363195431
     ]
   }

var feature = turf.feature(geometry);

//=feature
```

Returns **FeatureCollection** a FeatureCollection of input features

### point

Takes coordinates and properties (optional) and returns a new [Point](Point) feature.

**Parameters**

-   `coordinates` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** longitude, latitude position (each in decimal degrees)
-   `properties` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** an Object that is used as the [Feature](Feature)'s
    properties

**Examples**

```javascript
var pt1 = turf.point([-75.343, 39.984]);

//=pt1
```

Returns **Feature&lt;Point>** a Point feature

### polygon

Takes an array of LinearRings and optionally an [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) with properties and returns a [Polygon](Polygon) feature.

**Parameters**

-   `coordinates` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>>>** an array of LinearRings
-   `properties` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** a properties object

**Examples**

```javascript
var polygon = turf.polygon([[
 [-2.275543, 53.464547],
 [-2.275543, 53.489271],
 [-2.215118, 53.489271],
 [-2.215118, 53.464547],
 [-2.275543, 53.464547]
]], { name: 'poly1', population: 400});

//=polygon
```

-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** throw an error if a LinearRing of the polygon has too few positions
    or if a LinearRing of the Polygon does not have matching Positions at the
    beginning & end.

Returns **Feature&lt;Polygon>** a Polygon feature

### lineString

Creates a [LineString](LineString) based on a
coordinate array. Properties can be added optionally.

**Parameters**

-   `coordinates` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>>** an array of Positions
-   `properties` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** an Object of key-value pairs to add as properties

**Examples**

```javascript
var linestring1 = turf.lineString([
  [-21.964416, 64.148203],
  [-21.956176, 64.141316],
  [-21.93901, 64.135924],
  [-21.927337, 64.136673]
]);
var linestring2 = turf.lineString([
  [-21.929054, 64.127985],
  [-21.912918, 64.134726],
  [-21.916007, 64.141016],
  [-21.930084, 64.14446]
], {name: 'line 1', distance: 145});

//=linestring1

//=linestring2
```

-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** if no coordinates are passed

Returns **Feature&lt;LineString>** a LineString feature

### featureCollection

Takes one or more [Features](Feature) and creates a [FeatureCollection](FeatureCollection).

**Parameters**

-   `features` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;Feature>** input features

**Examples**

```javascript
var features = [
 turf.point([-75.343, 39.984], {name: 'Location A'}),
 turf.point([-75.833, 39.284], {name: 'Location B'}),
 turf.point([-75.534, 39.123], {name: 'Location C'})
];

var fc = turf.featureCollection(features);

//=fc
```

Returns **FeatureCollection** a FeatureCollection of input features

### multiLineString

Creates a [Feature&lt;MultiLineString>](Feature<MultiLineString>) based on a
coordinate array. Properties can be added optionally.

**Parameters**

-   `coordinates` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>>>** an array of LineStrings
-   `properties` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** an Object of key-value pairs to add as properties

**Examples**

```javascript
var multiLine = turf.multiLineString([[[0,0],[10,10]]]);

//=multiLine
```

-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** if no coordinates are passed

Returns **Feature&lt;MultiLineString>** a MultiLineString feature

### multiPoint

Creates a [Feature&lt;MultiPoint>](Feature<MultiPoint>) based on a
coordinate array. Properties can be added optionally.

**Parameters**

-   `coordinates` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>>** an array of Positions
-   `properties` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** an Object of key-value pairs to add as properties

**Examples**

```javascript
var multiPt = turf.multiPoint([[0,0],[10,10]]);

//=multiPt
```

-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** if no coordinates are passed

Returns **Feature&lt;MultiPoint>** a MultiPoint feature

### multiPolygon

Creates a [Feature&lt;MultiPolygon>](Feature<MultiPolygon>) based on a
coordinate array. Properties can be added optionally.

**Parameters**

-   `coordinates` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>>>>** an array of Polygons
-   `properties` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** an Object of key-value pairs to add as properties

**Examples**

```javascript
var multiPoly = turf.multiPolygon([[[[0,0],[0,10],[10,10],[10,0],[0,0]]]]);

//=multiPoly
```

-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** if no coordinates are passed

Returns **Feature&lt;MultiPolygon>** a multipolygon feature

### geometryCollection

Creates a [Feature&lt;GeometryCollection>](Feature<GeometryCollection>) based on a
coordinate array. Properties can be added optionally.

**Parameters**

-   `geometries` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;{Geometry}>** an array of GeoJSON Geometries
-   `properties` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** an Object of key-value pairs to add as properties

**Examples**

```javascript
var pt = {
    "type": "Point",
      "coordinates": [100, 0]
    };
var line = {
    "type": "LineString",
    "coordinates": [ [101, 0], [102, 1] ]
  };
var collection = turf.geometryCollection([pt, line]);

//=collection
```

Returns **Feature&lt;GeometryCollection>** a GeoJSON GeometryCollection Feature

### index

Normalize a GeoJSON feature into a FeatureCollection.

**Parameters**

-   `gj` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** geojson data

Returns **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** normalized geojson data
