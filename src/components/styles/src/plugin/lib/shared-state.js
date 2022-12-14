/* eslint-disable no-new-wrappers */
/* eslint-disable no-undef */
export const env = {
  NODE_ENV: process.env.NODE_ENV,
  DEBUG: resolveDebug(process.env.DEBUG)
};
export const contextMap = new Map();
export const configContextMap = new Map();
export const contextSourcesMap = new Map();
export const sourceHashMap = new Map();
export const NOT_ON_DEMAND = new String("*");

export function resolveDebug(debug) {
  if (debug === undefined) {
    return false;
  }

  // Environment variables are strings, so convert to boolean
  if (debug === "true" || debug === "1") {
    return true;
  }

  if (debug === "false" || debug === "0") {
    return false;
  }

  // Keep the debug convention into account:
  // DEBUG=* -> This enables all debug modes
  // DEBUG=projectA,projectB,projectC -> This enables debug for projectA, projectB and projectC
  // DEBUG=projectA:* -> This enables all debug modes for projectA (if you have sub-types)
  // DEBUG=projectA,-projectB -> This enables debug for projectA and explicitly disables it for projectB

  if (debug === "*") {
    return true;
  }

  const debuggers = debug.split(",").map((d) => d.split(":")[0]);

  // Ignoring aileron
  if (debuggers.includes("-aileron")) {
    return false;
  }

  // Including aileron
  if (debuggers.includes("aileron")) {
    return true;
  }

  return false;
}
