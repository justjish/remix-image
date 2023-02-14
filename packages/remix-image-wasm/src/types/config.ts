export type WasmModules = {
  pngWasm?: typeof PNG_WASM;
  avifDecWasm?: typeof AVIF_DEC_WASM;
  avifEncWasm?: typeof AVIF_ENC_WASM;
  jpegDecWasm?: typeof JPEG_DEC_WASM;
  jpegEncWasm?: typeof JPEG_ENC_WASM;
  webpDecWasm?: typeof WEBP_DEC_WASM;
  webpEncWasm?: typeof WEBP_ENC_WASM;
};

export type Config = {
  modules?: WasmModules;
};
