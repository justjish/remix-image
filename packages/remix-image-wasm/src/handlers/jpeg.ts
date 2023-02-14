import decode, { init as initDecode } from "@jsquash/jpeg/decode";
import encode, { init as initEncode } from "@jsquash/jpeg/encode";
import { ImageHandler } from "../types/transformer";
/**
 * JpegHandler
 * @deprecated use createJpegHandler instead.
 */
export const JpegHandler: ImageHandler = {
  async decode(buffer) {
    await initDecode(JPEG_DEC_WASM);

    return decode(buffer);
  },
  async encode(image, options) {
    await initEncode(JPEG_ENC_WASM);

    return encode(image, options);
  },
};
/**
 * createJpegHandler
 * Allows user to optionally pass in modules required by encoder/decoder.
 * @param modules
 * @returns
 */
export const createJpegHandler = (modules?: {
  jpegDecWasm: typeof JPEG_DEC_WASM;
  jpegEncWasm: typeof JPEG_ENC_WASM;
}): ImageHandler => {
  const jpegDecWasm = modules?.jpegDecWasm ?? JPEG_DEC_WASM;
  const jpegEncWasm = modules?.jpegEncWasm ?? JPEG_ENC_WASM;
  return {
    async decode(buffer) {
      await initDecode(jpegDecWasm);

      return decode(buffer);
    },
    async encode(image, options) {
      await initEncode(jpegEncWasm);

      return encode(image, options);
    },
  };
};
