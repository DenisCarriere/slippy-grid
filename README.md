# Slippy Grid

[![Build Status](https://travis-ci.org/DenisCarriere/slippy-grid.svg?branch=master)](https://travis-ci.org/DenisCarriere/slippy-grid)
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
<script src="https://unpkg.com/slippy-grid/docs/slippy-grid.min.js"></script>
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

### all

All Tiles from a given BBox

**Parameters**

-   `extent` **(BBox | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;BBox> | GeoJSON)** BBox [west, south, east, north] order or GeoJSON Polygon
-   `minZoom` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Minimum Zoom
-   `maxZoom` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Maximum Zoom

**Examples**

```javascript
const tiles = slippyGrid.all([-180.0, -90.0, 180, 90], 3, 8)
//=tiles
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;Tile>** Tiles from extent

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
