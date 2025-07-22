/**
 * Utility functions for the Figma plugin
 */

/**
 * Custom base64 encoding implementation for GitHub API compatibility
 * 
 * @param str - String to encode
 * @returns Base64 encoded string
 */
export function base64Encode(str: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
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

  const padding = str.length % 3;
  if (padding === 1) {
    result = result.slice(0, -2) + "==";
  } else if (padding === 2) {
    result = result.slice(0, -1) + "=";
  }

  return result;
}

/**
 * Converts RGB color values to HSL format
 * 
 * @param r - Red component (0-1)
 * @param g - Green component (0-1)
 * @param b - Blue component (0-1)
 * @returns HSL color string (e.g., hsl(120 100% 50%))
 */
export const rgbToHsl = (r: number, g: number, b: number): string => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  
  // Lightness
  const l = (max + min) / 2;
  
  // Saturation
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  
  // Hue
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  
  const hslH = Math.round(h);
  const hslS = Math.round(s * 100);
  const hslL = Math.round(l * 100);
  
  return `hsl(${hslH} ${hslS}% ${hslL}%)`;
};

/**
 * Converts RGBA color values to HSLA format with decimal alpha
 * 
 * @param r - Red component (0-1)
 * @param g - Green component (0-1)
 * @param b - Blue component (0-1)
 * @param a - Alpha component (0-1)
 * @returns HSLA color string (e.g., hsl(120 100% 50% / .5))
 */
export const rgbaToHsl = (r: number, g: number, b: number, a: number): string => {
  if (a === 1) return rgbToHsl(r, g, b);
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  
  const hslH = Math.round(h);
  const hslS = Math.round(s * 100);
  const hslL = Math.round(l * 100);
  const alpha = a < 1 ? `.${Math.round(a * 10)}` : '1';
  
  return `hsl(${hslH} ${hslS}% ${hslL}% / ${alpha})`;
};

/**
 * Converts pixel values to rem units (assuming 16px base)
 * 
 * @param px - Pixel value
 * @returns Rem value string (e.g., 1rem)
 */
export const pxToRem = (px: number): string => {
  const rem = px / 16;
  return `${rem}rem`;
};

/**
 * Formats decimal alpha values properly (.1, .2, etc.)
 * 
 * @param alpha - Alpha value (0-1)
 * @returns Formatted decimal string
 */
export const formatAlpha = (alpha: number): string => {
  if (alpha === 1) return '1';
  if (alpha === 0) return '0';
  return `.${Math.round(alpha * 10)}`;
};
