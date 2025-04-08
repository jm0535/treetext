/// <reference types="vite/client" />

// Handle WASM imports
declare module '*.wasm' {
  const src: string;
  export default src;
}

declare interface ImportMeta {
  url: string;
}
