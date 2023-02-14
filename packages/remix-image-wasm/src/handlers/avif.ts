import decode, { init as initDecode } from "@jsquash/avif/decode";
import encode, { init as initEncode } from "@jsquash/avif/encode";
import { ImageHandler } from "../types/transformer";

/**
 * AvifHandler
 * @deprecated use createAvifHandler instead
 */
export const AvifHandler: ImageHandler = {
  async decode(buffer) {
    await initDecode(AVIF_DEC_WASM);
    return decode(buffer);
  },
  async encode(image) {
    await initEncode(AVIF_ENC_WASM);
    return encode(image);
  },
};

/**
 * createAvifHandler
 * Allows user to optionally pass in modules required by encoder/decoder.
 * @param modules
 * @returns
 */
export const createAvifHandler = (modules: {
  avifDecWasm: typeof AVIF_DEC_WASM;
  avifEncWasm: typeof AVIF_ENC_WASM;
}): ImageHandler => {
  const avifDecWasm = modules?.avifDecWasm ?? AVIF_DEC_WASM;
  const avifEncWasm = modules?.avifEncWasm ?? AVIF_ENC_WASM;
  return {
    async decode(buffer) {
      await initDecode(avifDecWasm);
      return decode(buffer);
    },
    async encode(image) {
      await initEncode(avifEncWasm);
      return encode(image);
    },
  };
};
