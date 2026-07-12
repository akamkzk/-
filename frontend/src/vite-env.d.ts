/// <reference types="vite/client" />
declare module '*.glb';
declare module '*.glb?url';
declare module '*.png';
declare module '*.png?url';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any
      meshLineMaterial: any
    }
  }
}
