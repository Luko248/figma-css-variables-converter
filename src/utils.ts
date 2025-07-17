/**
 * Utility functions for the Figma Variables to GitHub Plugin
 */

/**
 * Manual Base64 encoding for Figma environment
 */
export function base64Encode(str: string): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let result = "";
  let i = 0;

  while (i < str.length) {
    const a = str.charCodeAt(i++);
    const b = i < str.length ? str.charCodeAt(i++) : 0;
    const c = i < str.length ? str.charCodeAt(i++) : 0;

    const bitmap = (a << 16) | (b << 8) | c;

    result += chars.charAt((bitmap >> 18) & 63);
    result += chars.charAt((bitmap >> 12) & 63);
    result += chars.charAt((bitmap >> 6) & 63);
    result += chars.charAt(bitmap & 63);
  }

  const paddingLength = (3 - (str.length % 3 || 3)) % 3;
  return (
    result.slice(0, result.length - paddingLength) + "=".repeat(paddingLength)
  );
}

/**
 * Figma color object interface
 */
interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

/**
 * Helper function to convert Figma colors to CSS
 */
export function figmaColorToCSS(colorObj: string | FigmaColor | unknown): string {
  if (typeof colorObj === "string") {
    return colorObj;
  }

  if (colorObj && typeof colorObj === "object" && "r" in colorObj) {
    const color = colorObj as FigmaColor;
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);

    if (color.a !== undefined && color.a < 1) {
      return `rgba(${r}, ${g}, ${b}, ${color.a})`;
    } else {
      const toHex = (n: number) => n.toString(16).padStart(2, "0");
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
  }

  return String(colorObj);
}

/**
 * Clean variable name for CSS usage
 */
export function cleanVariableName(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, "$1-$2") // Handle camelCase
    .replace(/\//g, "-")
    .toLowerCase();
}
