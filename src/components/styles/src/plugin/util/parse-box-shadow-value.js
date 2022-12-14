/* eslint-disable no-useless-escape */
import { splitAtTopLevelOnly } from "./split-at-top-level-only.js";

const KEYWORDS = new Set(["inset", "inherit", "initial", "revert", "unset"]);
const SPACE = /\ +(?![^(]*\))/g; // Similar to the one above, but with spaces instead.
const LENGTH = /^-?(\d+|\.\d+)(.*?)$/g;

export function parseBoxShadowValue(input) {
  const shadows = Array.from(splitAtTopLevelOnly(input, ","));
  return shadows.map((shadow) => {
    const value = shadow.trim();
    const result = { raw: value };
    const parts = value.split(SPACE);
    const seen = new Set();

    for (const part of parts) {
      // Reset index, since the regex is stateful.
      LENGTH.lastIndex = 0;

      // Keyword
      if (!seen.has("KEYWORD") && KEYWORDS.has(part)) {
        result.keyword = part;
        seen.add("KEYWORD");
      }

      // Length value
      else if (LENGTH.test(part)) {
        if (!seen.has("X")) {
          result.x = part;
          seen.add("X");
        } else if (!seen.has("Y")) {
          result.y = part;
          seen.add("Y");
        } else if (!seen.has("BLUR")) {
          result.blur = part;
          seen.add("BLUR");
        } else if (!seen.has("SPREAD")) {
          result.spread = part;
          seen.add("SPREAD");
        }
      }

      // Color or unknown
      else {
        if (!result.color) {
          result.color = part;
        } else {
          if (!result.unknown) result.unknown = [];
          result.unknown.push(part);
        }
      }
    }

    // Check if valid
    result.valid = result.x !== undefined && result.y !== undefined;

    return result;
  });
}

export function formatBoxShadowValue(shadows) {
  return shadows
    .map((shadow) => {
      if (!shadow.valid) {
        return shadow.raw;
      }

      return [shadow.keyword, shadow.x, shadow.y, shadow.blur, shadow.spread, shadow.color]
        .filter(Boolean)
        .join(" ");
    })
    .join(", ");
}
