/**
 * Types
 */
export declare type BBox = [number, number, number, number];
export declare type Tile = [number, number, number];
export declare type Level = [number[], number[], number];

/**
 * Methods
 */
export declare function single(extent: BBox| BBox[], minZoom: number, maxZoom: number): Iterator<Tile>;
export declare function bulk(extent: BBox| BBox[], minZoom: number, maxZoom: number, size: number): Iterator<Tile[]>;
export declare function levels(extent: BBox| BBox[], minZoom: number, maxZoom: number): Level[];
export declare function count(extent: BBox| BBox[], minZoom: number, maxZoom: number): number;