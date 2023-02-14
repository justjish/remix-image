import ImageData from "./types/ImageData";
export * from "./core/generators";
// @ts-ignore Simple Polyfill ImageData Object
globalThis.ImageData = ImageData;
export * from "./wasmTransformer";
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const version: string = "__remix_image_version";
