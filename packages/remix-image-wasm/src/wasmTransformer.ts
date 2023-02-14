import {
  getSupportedInputs,
  getSupportedOutputs,
  createWasmTransformer,
} from "./core/generators";

/**
 * supportedOutputs
 * Uses global variables to determine if a given output is supported.
 */
export const supportedOutputs = getSupportedOutputs();

/**
 * supportedInputs
 * Uses global variables to determine if a given input is supported.
 */
export const supportedInputs = getSupportedInputs();

/**
 * wasmTransformer
 * Uses global variables to determine if a given input is supported.
 */
export const wasmTransformer = createWasmTransformer();
