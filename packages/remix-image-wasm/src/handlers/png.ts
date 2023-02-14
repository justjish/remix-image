import decode, { init as initDecode } from "@jsquash/png/decode";
import encode, { init as initEncode } from "@jsquash/png/encode";
import { ImageHandler } from "../types/transformer";
/**
 * PngHandler
 * @deprecated use createPngHandler instead
 */
export const PngHandler: ImageHandler = {
  async decode(buffer) {
    await initDecode(PNG_WASM);

    return decode(buffer);
  },
  async encode(image) {
    await initEncode(PNG_WASM);

    return encode(image);
  },
};
/**
 * createPngHandler
 * Allows user to optionally pass in modules required by encoder/decoder.
 * @param modules
 * @returns
 */
export const createPngHandler = (modules?: {
  pngWasm: typeof PNG_WASM;
}): ImageHandler => {
  const pngWasm = modules?.pngWasm ?? PNG_WASM;
  return {
    async decode(buffer) {
      await initDecode(pngWasm);

      return decode(buffer);
    },
    async encode(image) {
      await initEncode(pngWasm);

      return encode(image);
    },
  };
};
