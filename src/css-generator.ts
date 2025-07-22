/**
 * CSS generation utilities for converting Figma variables to CSS values
 */
import './types';
import { rgbToHsl, rgbaToHsl, pxToRem } from './utils';
import { detectVariableType } from './variable-detectors';

/**
 * Converts a Figma variable to its corresponding CSS value
 * 
 * @param variable - The Figma variable object
 * @returns CSS-compatible string value
 */
export const generateCSSValue = (variable: Variable): string => {
  try {
    const valueConverters = {
      COLOR: convertColorValue,
      FLOAT: convertFloatValue,
      STRING: convertStringValue,
    };
    
    const converter = valueConverters[variable.resolvedType as keyof typeof valueConverters];
    return converter ? converter(variable) : '';
  } catch (error) {
    console.error(`Error generating CSS value for variable ${variable.name}:`, error);
    return '';
  }
};

/**
 * Converts color variables to HSL format
 */
const convertColorValue = (variable: Variable): string => {
  const modeValues = Object.values(variable.valuesByMode || {});
  if (modeValues.length === 0) return 'hsl(0 0% 0%)';
  
  const colorValue = modeValues[0] as RGB | RGBA;
  return 'a' in colorValue
    ? rgbaToHsl(colorValue.r, colorValue.g, colorValue.b, colorValue.a)
    : rgbToHsl(colorValue.r, colorValue.g, colorValue.b);
};

/**
 * Converts float variables based on their type
 */
const convertFloatValue = (variable: Variable): string => {
  const modeValues = Object.values(variable.valuesByMode || {});
  if (modeValues.length === 0) return '0';
  
  const floatValue = modeValues[0] as number;
  const variableType = detectVariableType(variable.name);
  
  const formatters: Record<string, (value: number) => string> = {
    opacity: (v) => v.toString(),
    spacing: (v) => pxToRem(v),
    sizing: (v) => pxToRem(v),
    'border-radius': (v) => pxToRem(v),
    'font-weight': (v) => Math.round(v).toString(),
    animation: (v) => `${v}ms`,
  };
  
  const formatter = formatters[variableType];
  return formatter ? formatter(floatValue) : floatValue.toString();
};

/**
 * Converts string variables with proper formatting
 */
const convertStringValue = (variable: Variable): string => {
  const modeValues = Object.values(variable.valuesByMode || {});
  if (modeValues.length === 0) return '';
  
  const stringValue = modeValues[0] as string;
  const variableType = detectVariableType(variable.name);
  
  return variableType === 'font-family' ? `"${stringValue}"` : stringValue;
};

/**
 * Builds the final CSS output with proper formatting and grouping
 * 
 * @param cssVariables - Array of processed CSS variables
 * @returns Complete CSS custom properties in :root selector
 */
export function buildCSSOutput(cssVariables: Array<{name: string, value: string, type: string}>): string {
  if (cssVariables.length === 0) {
    return '/* No variables found */';
  }

  let css = ':root {\n';
  
  /** Group variables by type for better organization */
  const groupedVariables: Record<string, Array<{name: string, value: string}>> = {};
  
  cssVariables.forEach(variable => {
    if (!groupedVariables[variable.type]) {
      groupedVariables[variable.type] = [];
    }
    groupedVariables[variable.type].push({
      name: variable.name,
      value: variable.value
    });
  });
  
  // Add variables grouped by type
  Object.entries(groupedVariables).forEach(([type, variables]) => {
    css += `\n  /* ${type.charAt(0).toUpperCase() + type.slice(1)} Variables */\n`;
    variables.forEach(variable => {
      css += `  ${variable.name}: ${variable.value};\n`;
    });
  });
  
  css += '}\n';
  
  return css;
}
