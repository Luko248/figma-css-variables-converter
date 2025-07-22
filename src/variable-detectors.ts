/**
 * Variable type detection and CSS naming utilities
 */

/**
 * Detects the type of a variable based on its name patterns
 * 
 * @param name - The variable name to analyze
 * @returns The detected variable type category
 */
export const detectVariableType = (name: string): string => {
  const lowerName = name.toLowerCase();
  
  const typeDetectors = [
    { type: 'spacing', check: isSpacingVariable },
    { type: 'sizing', check: isSizingVariable },
    { type: 'border-radius', check: isRadiusVariable },
    { type: 'opacity', check: isOpacityVariable },
    { type: 'elevation', check: isElevationVariable },
    { type: 'font-family', check: isFontFamilyVariable },
    { type: 'font-weight', check: isFontWeightVariable },
    { type: 'animation', check: isAnimationVariable },
  ];
  
  const detectedType = typeDetectors.find(detector => detector.check(lowerName));
  return detectedType?.type || 'other';
};

// Lambda functions for type detection
const isSpacingVariable = (name: string): boolean =>
  ['spacing', 'space', 'gap', 'margin', 'padding', 'pad'].some(term => name.includes(term)) ||
  /\b(xs|sm|md|lg|xl|xxl)\b/.test(name);

const isSizingVariable = (name: string): boolean =>
  ['size', 'width', 'height', 'dimension'].some(term => name.includes(term));

const isRadiusVariable = (name: string): boolean =>
  ['radius', 'rounded', 'corner'].some(term => name.includes(term));

const isOpacityVariable = (name: string): boolean =>
  ['opacity', 'alpha', 'transparency'].some(term => name.includes(term));

const isElevationVariable = (name: string): boolean =>
  ['elevation', 'shadow', 'depth', 'z-index'].some(term => name.includes(term));

const isFontFamilyVariable = (name: string): boolean =>
  name.includes('font') && ['family', 'typeface'].some(term => name.includes(term));

const isFontWeightVariable = (name: string): boolean =>
  ['weight', 'bold', 'light', 'medium'].some(term => name.includes(term));

const isAnimationVariable = (name: string): boolean =>
  ['duration', 'timing', 'animation', 'transition'].some(term => name.includes(term));

/**
 * Generates a CSS custom property name from a Figma variable
 * Format: --{type}_{clean-name} (e.g., --color_btn-bg, --space_btn-pad-inline)
 * 
 * @param _collectionName - Collection name (unused in current implementation)
 * @param variableName - The Figma variable name
 * @returns Formatted CSS custom property name
 */
export const generateCSSVariableName = (_collectionName: string, variableName: string): string => {
  const variableType = detectVariableType(variableName);
  const typePrefix = getTypePrefix(variableType);
  const cleanVariable = cleanVariableName(variableName);
  
  return `--${typePrefix}_${cleanVariable}`;
};

/**
 * Cleans and formats variable name with camelCase to kebab-case conversion
 * 
 * @param name - Raw variable name
 * @returns Cleaned variable name
 */
const cleanVariableName = (name: string): string => name
  .replace(/([a-z])([A-Z])/g, '$1-$2') // Convert camelCase to kebab-case
  .toLowerCase()
  .replace(/[^a-z0-9-]/g, '') // Keep only letters, numbers, and hyphens
  .replace(/-+/g, '-') // Remove duplicate hyphens
  .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

/**
 * Maps variable types to CSS prefix names
 * 
 * @param variableType - The detected variable type
 * @returns Short prefix for CSS custom property names
 */
const getTypePrefix = (variableType: string): string => {
  const typePrefixMap: Record<string, string> = {
    spacing: 'space',
    sizing: 'size',
    'border-radius': 'radius',
    opacity: 'opacity',
    elevation: 'elevation',
    'font-family': 'font',
    'font-weight': 'weight',
    animation: 'anim',
  };
  
  return typePrefixMap[variableType] || 'color';
};
