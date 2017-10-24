import {MultiPolygon, Polygon, Feature, FeatureCollection, BBox} from '@turf/helpers'

/**
 * Types
 */
export declare type Polygons = MultiPolygon | Polygon
export declare type Tile = [number, number, number];
export declare type Level = [number[], number[], number];
export declare type Extent = BBox | BBox[] | Feature<Polygons> | FeatureCollection<Polygons>;

/**
 * Methods
 */
export declare function all(extent: Extent, minZoom: number, maxZoom: number): Tile[];
export declare function single(extent: Extent, minZoom: number, maxZoom: number): Iterator<Tile>;
export declare function geojson(extent: Extent, minZoom: number, maxZoom: number): Iterator<Tile>;
export declare function getChildren(parentTile: Tile, maxZoom: number): Iterator<Tile>;
export declare function bulk(extent: Extent, minZoom: number, maxZoom: number, size: number): Iterator<Tile[]>;
export declare function levels(extent: Extent, minZoom: number, maxZoom: number): Level[];
export declare function count(extent: Extent, minZoom: number, maxZoom: number, quick?: number): number;
