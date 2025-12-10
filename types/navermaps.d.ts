/**
 * @file navermaps.d.ts
 * @description Naver Maps API 타입 정의
 *
 * Naver Maps JavaScript API v3 (NCP)의 타입 정의입니다.
 * @types/navermaps 패키지가 없을 경우를 대비한 기본 타입 정의입니다.
 *
 * @see {@link https://navermaps.github.io/maps.js.ncp/docs/} - Naver Maps API 문서
 */

declare namespace naver.maps {
  export class Map {
    constructor(element: HTMLElement | string, options?: MapOptions);
    setCenter(latlng: LatLng | LatLngLiteral): void;
    getCenter(): LatLng;
    setZoom(zoom: number): void;
    getZoom(): number;
    panTo(latlng: LatLng | LatLngLiteral, options?: PanOptions): void;
    fitBounds(bounds: LatLngBounds): void;
    setSize(size: Size): void;
    destroy(): void;
    addListener(event: string, listener: Function): void;
    removeListener(event: string, listener: Function): void;
  }

  export interface MapOptions {
    center?: LatLng | LatLngLiteral;
    zoom?: number;
    mapTypeId?: MapTypeId;
    mapTypeControl?: boolean;
    zoomControl?: boolean;
    zoomControlOptions?: ZoomControlOptions;
  }

  export type MapTypeId = 'normal' | 'satellite' | 'hybrid' | 'terrain';

  export interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  export class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  export class LatLngBounds {
    constructor(sw?: LatLng, ne?: LatLng);
    extend(latlng: LatLng | LatLngLiteral): void;
    getSW(): LatLng;
    getNE(): LatLng;
    isEmpty(): boolean;
  }

  export class Marker {
    constructor(options: MarkerOptions);
    setPosition(latlng: LatLng | LatLngLiteral): void;
    getPosition(): LatLng;
    setMap(map: Map | null): void;
    getMap(): Map | null;
    setIcon(icon: MarkerImage | string): void;
    setZIndex(zIndex: number): void;
    addListener(event: string, listener: Function): void;
    removeListener(event: string, listener: Function): void;
  }

  export interface MarkerOptions {
    position: LatLng | LatLngLiteral;
    map?: Map;
    icon?: MarkerImage | string;
    title?: string;
    zIndex?: number;
    clickable?: boolean;
    draggable?: boolean;
  }

  export class MarkerImage {
    constructor(
      url: string,
      size?: Size,
      origin?: Point,
      anchor?: Point,
      scaledSize?: Size,
    );
  }

  export class Size {
    constructor(width: number, height: number);
    width: number;
    height: number;
  }

  export class Point {
    constructor(x: number, y: number);
    x: number;
    y: number;
  }

  export class InfoWindow {
    constructor(options?: InfoWindowOptions);
    open(map: Map, marker?: Marker): void;
    close(): void;
    setContent(content: string | HTMLElement): void;
    getContent(): string | HTMLElement;
    setPosition(latlng: LatLng | LatLngLiteral): void;
    getPosition(): LatLng;
  }

  export interface InfoWindowOptions {
    content?: string | HTMLElement;
    position?: LatLng | LatLngLiteral;
    pixelOffset?: Point;
    maxWidth?: number;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    anchorColor?: string;
    anchorSize?: Size;
    anchorSkew?: boolean;
    anchorShape?: string;
    zIndex?: number;
  }

  export interface PanOptions {
    duration?: number;
    easing?: string;
  }

  export interface ZoomControlOptions {
    position?: Position;
    style?: ZoomControlStyle;
  }

  export type Position =
    | 'TOP_LEFT'
    | 'TOP_CENTER'
    | 'TOP_RIGHT'
    | 'BOTTOM_LEFT'
    | 'BOTTOM_CENTER'
    | 'BOTTOM_RIGHT'
    | 'LEFT_TOP'
    | 'LEFT_CENTER'
    | 'LEFT_BOTTOM'
    | 'RIGHT_TOP'
    | 'RIGHT_CENTER'
    | 'RIGHT_BOTTOM';

  export type ZoomControlStyle = 'SMALL' | 'LARGE';

  export class ZoomControl {
    constructor(options?: ZoomControlOptions);
  }

  export class MapTypeControl {
    constructor(options?: MapTypeControlOptions);
  }

  export interface MapTypeControlOptions {
    position?: Position;
    mapTypeIds?: MapTypeId[];
    style?: MapTypeControlStyle;
  }

  export type MapTypeControlStyle = 'BUTTON' | 'DROPDOWN';

  export namespace Event {
    function addListener(
      instance: Map | Marker,
      eventName: string,
      listener: Function,
    ): void;
    function removeListener(
      instance: Map | Marker,
      eventName: string,
      listener: Function,
    ): void;
  }
}

declare const naver: {
  maps: typeof naver.maps;
};

