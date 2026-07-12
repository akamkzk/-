/// <reference types="vite/client" />
declare module '*.glb';
declare module '*.glb?url';
declare module '*.png';
declare module '*.png?url';

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any
      meshLineMaterial: any
    }
  }
}
