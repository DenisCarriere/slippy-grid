/// <reference types="geojson" />

/**
 * Types
 */
export declare type Polygon = GeoJSON.Feature<GeoJSON.Polygon>
export declare type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>
export declare type MultiPolygon = GeoJSON.Feature<GeoJSON.MultiPolygon>
export declare type MultiPolygons = GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>
export declare type BBox = [number, number, number, number];
export declare type Tile = [number, number, number];
export declare type Level = [number[], number[], number];
export declare type Extent = BBox | BBox[] | Polygon | Polygons | MultiPolygon | MultiPolygons

/**
 * Methods
 */
export declare function single(extent: Extent, minZoom: number, maxZoom: number): Iterator<Tile>;
export declare function bulk(extent: Extent, minZoom: number, maxZoom: number, size: number): Iterator<Tile[]>;
export declare function levels(extent: Extent, minZoom: number, maxZoom: number): Level[];
export declare function count(extent: Extent, minZoom: number, maxZoom: number, quick?: number): number;
