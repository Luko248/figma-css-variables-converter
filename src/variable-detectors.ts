/**
 * Variable type detection functions based on naming patterns
 */

/**
 * Check if variable is likely a spacing value
 */
export function isSpacingVariable(name: string): boolean {
  const spacingKeywords = [
    "spacing",
    "margin",
    "padding",
    "gap",
    "gutter",
    "space",
  ];
  return spacingKeywords.some((keyword) =>
    name.toLowerCase().includes(keyword)
  );
}

/**
 * Check if variable is likely a sizing value
 */
export function isSizingVariable(name: string): boolean {
  const sizingKeywords = ["size", "width", "height", "dimension", "scale"];
  return sizingKeywords.some((keyword) => name.toLowerCase().includes(keyword));
}

/**
 * Check if variable is likely a border radius value
 */
export function isBorderRadiusVariable(name: string): boolean {
  const radiusKeywords = ["radius", "border-radius", "corner", "rounded"];
  return radiusKeywords.some((keyword) => name.toLowerCase().includes(keyword));
}

/**
 * Check if variable is likely an opacity value
 */
export function isOpacityVariable(name: string): boolean {
  const opacityKeywords = ["opacity", "alpha", "transparency"];
  return opacityKeywords.some((keyword) =>
    name.toLowerCase().includes(keyword)
  );
}

/**
 * Check if variable is likely an elevation/shadow value
 */
export function isElevationVariable(name: string): boolean {
  const elevationKeywords = [
    "elevation",
    "shadow",
    "depth",
    "z-index",
    "layer",
  ];
  return elevationKeywords.some((keyword) =>
    name.toLowerCase().includes(keyword)
  );
}

/**
 * Check if variable is likely a font family value
 */
export function isFontFamilyVariable(name: string): boolean {
  const fontFamilyKeywords = ["font-family", "typeface", "font"];
  return fontFamilyKeywords.some((keyword) =>
    name.toLowerCase().includes(keyword)
  );
}

/**
 * Check if variable is likely a font weight value
 */
export function isFontWeightVariable(name: string): boolean {
  const fontWeightKeywords = [
    "font-weight",
    "weight",
    "bold",
    "light",
    "medium",
  ];
  return fontWeightKeywords.some((keyword) =>
    name.toLowerCase().includes(keyword)
  );
}

/**
 * Check if variable is likely an animation value
 */
export function isAnimationVariable(name: string): boolean {
  const animationKeywords = [
    "animation",
    "transition",
    "duration",
    "timing",
    "easing",
  ];
  return animationKeywords.some((keyword) =>
    name.toLowerCase().includes(keyword)
  );
}
