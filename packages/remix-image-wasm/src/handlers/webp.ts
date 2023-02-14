import decode, { init as initDecode } from "@jsquash/webp/decode";
import encode, { init as initEncode } from "@jsquash/webp/encode";
import { ImageHandler } from "../types/transformer";
/**
 * WebpHandler
 * @deprecated use createWebpHandler instead
 */
export const WebpHandler: ImageHandler = {
  async decode(buffer) {
    await initDecode(WEBP_DEC_WASM);

    return decode(buffer);
  },
  async encode(image, options) {
    await initEncode(WEBP_ENC_WASM);

    return encode(image, options);
  },
};
/**
 * createWebpHandler
 * Allows user to optionally pass in modules required by encoder/decoder.
 * @param modules
 * @returns
 */
export const createWebpHandler = (modules?: {
  webpDecWasm: typeof WEBP_DEC_WASM;
  webpEncWasm: typeof WEBP_ENC_WASM;
}): ImageHandler => {
  const webpDecWasm = modules?.webpDecWasm ?? WEBP_DEC_WASM;
  const webpEncWasm = modules?.webpEncWasm ?? WEBP_ENC_WASM;
  return {
    async decode(buffer) {
      await initDecode(webpDecWasm);
      return decode(buffer);
    },
    async encode(image, options) {
      await initEncode(webpEncWasm);
      return encode(image, options);
    },
  };
};
