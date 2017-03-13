
# Changelog

## 2.0.0 - 2017-03-17

- Add `all()` method to return all tiles in a simple `Array`
- Support Fiji Extent & any extent that share +180 & -180 degrees
- Dropped GeoJSON precise extent (only support BBox of a GeoJSON)

## 1.4.0 - 2017-03-10

- Fix `levels()` & `count()` not returning the correct results.

## 1.3.0 - 2017-03-04

- Output browser bundle to docs UMD
- Change rollup config
- Rebuild library to pure ES6
- Improved documentation
- Add test case for slippyGrid.levels() => World Zoom Level 1

## 1.2.1 - 2017-03-02

- Removed `fastCount` from Typescript definition
- Lowered quick count to 1000

## 1.2.0 - 2017-02-22

- Support overlapping GeoJSON properties with multiple different zoom levels
- Filter by minZoom & maxZoom via GeoJSON properties

## 1.1.0 - 2017-02-21

- Support Multiple GeoJSON Polygon
- Added GeoJSON input support

## 1.0.0 - 2017-02-18

- Stable release
- Initialize library