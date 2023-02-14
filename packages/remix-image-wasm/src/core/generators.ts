import { ImagePosition, MimeType, Transformer } from "remix-image";
import {
  createAvifHandler,
  createJpegHandler,
  createPngHandler,
  createWebpHandler,
} from "../handlers";
import { blurImage } from "../operations/blur";
import { cropImage } from "../operations/crop";
import { flipImage } from "../operations/flip";
import { resizeImage } from "../operations/js-resize";
import { rotateImage } from "../operations/rotate";
import { type WasmModules, type Config } from "../types/config";
import { ImageHandler } from "../types/transformer";

/**
 * getSupportedOutputs
 * Used to create a set of supported output types.
 * @param modules
 **/
export const getSupportedOutputs = ({
  pngWasm,
  avifEncWasm,
  jpegEncWasm,
  webpEncWasm,
}: Pick<
  WasmModules,
  "pngWasm" | "avifEncWasm" | "jpegEncWasm" | "webpEncWasm"
> = {}) => {
  return new Set<MimeType>(
    Object.entries({
      [MimeType.PNG]: pngWasm ?? typeof PNG_WASM != "undefined",
      [MimeType.JPEG]: jpegEncWasm ?? typeof JPEG_ENC_WASM != "undefined",
      [MimeType.WEBP]: webpEncWasm ?? typeof WEBP_ENC_WASM != "undefined",
      [MimeType.AVIF]: avifEncWasm ?? typeof AVIF_ENC_WASM != "undefined",
    }).reduce<MimeType[]>((accum, [mimeType, isSupported]) => {
      if (isSupported) {
        accum.push(mimeType as MimeType);
      }
      return accum;
    }, [])
  );
};

/**
 * getSupportedInputs
 * Used to create a set of supported output types.
 * Takes into account the user's config.
 * @param modules
 **/
export const getSupportedInputs = ({
  pngWasm,
  avifDecWasm,
  jpegDecWasm,
  webpDecWasm,
}: Pick<
  WasmModules,
  "pngWasm" | "avifDecWasm" | "jpegDecWasm" | "webpDecWasm"
> = {}) => {
  return new Set<MimeType>(
    Object.entries({
      [MimeType.PNG]: pngWasm ?? typeof PNG_WASM != "undefined",
      [MimeType.JPEG]: jpegDecWasm ?? typeof JPEG_DEC_WASM != "undefined",
      [MimeType.WEBP]: webpDecWasm ?? typeof WEBP_DEC_WASM != "undefined",
      [MimeType.AVIF]: avifDecWasm ?? typeof AVIF_DEC_WASM != "undefined",
    }).reduce<MimeType[]>((accum, [mimeType, isSupported]) => {
      if (isSupported) {
        accum.push(mimeType as MimeType);
      }

      return accum;
    }, [])
  );
};

/**
 * createTypeHandlers
 * Used to create a map of type handlers.
 * @returns
 */
const createTypeHandlers = ({
  pngWasm,
  avifDecWasm,
  avifEncWasm,
  jpegDecWasm,
  jpegEncWasm,
  webpDecWasm,
  webpEncWasm,
}: WasmModules = {}) => {
  return {
    [MimeType.PNG]: createPngHandler({ pngWasm }),
    [MimeType.JPEG]: createJpegHandler({
      jpegDecWasm,
      jpegEncWasm,
    }),
    [MimeType.AVIF]: createAvifHandler({
      avifDecWasm,
      avifEncWasm,
    }),
    [MimeType.WEBP]: createWebpHandler({
      webpDecWasm,
      webpEncWasm,
    }),
  } as Record<string, ImageHandler>;
};
/**
 * createWasmTransformer
 * Used to create a transformer that uses wasm to transform images.
 * Allows the ability to pass in custom wasm modules.
 * @param config: Config
 * @returns
 */
export const createWasmTransformer = ({
  modules,
}: Config = {}): Transformer => {
  const supportedInputs = getSupportedInputs(modules);
  const supportedOutputs = getSupportedOutputs(modules);
  const typeHandlers = createTypeHandlers(modules);
  const wasmTransformer: Transformer = {
    name: "wasmTransformer",
    supportedInputs,
    supportedOutputs,
    fallbackOutput: Array.from(supportedOutputs.values())[0],
    transform: async (
      { data, contentType: inputContentType },
      {
        contentType: outputContentType = inputContentType,
        width,
        height,
        fit,
        position,
        background,
        quality,
        loop,
        delay,
        blurRadius,
        rotate,
        flip,
        crop,
        compressionLevel,
      }
    ) => {
      let image = await typeHandlers[inputContentType].decode(data);

      if (crop) {
        image = await cropImage(image, crop, background);
      }

      if (width != null || height != null) {
        image = await resizeImage(
          image,
          width,
          height,
          {
            fit,
            position: position as ImagePosition,
          },
          background
        );
      }

      if (flip) {
        image = await flipImage(image, flip);
      }

      if (rotate && rotate !== 0) {
        image = await rotateImage(image, rotate, background);
      }

      if (blurRadius && blurRadius > 0) {
        image = await blurImage(image, blurRadius);
      }

      const result = await typeHandlers[outputContentType].encode(image, {
        width: image.width,
        height: image.height,
        fit,
        position,
        background,
        quality,
        compressionLevel,
        loop,
        delay,
      });

      return new Uint8Array(result);
    },
  };
  return wasmTransformer;
};
