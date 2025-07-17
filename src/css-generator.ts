// CSS generation functions
import './types';
import { rgbToHex, rgbaToHex } from './utils';
import { detectVariableType, generateCSSVariableName } from './variable-detectors';

export function generateCSSValue(variable: Variable): string {
  try {
    switch (variable.resolvedType) {
      case 'COLOR':
        if (variable.valuesByMode) {
          const modeValues = Object.values(variable.valuesByMode);
          if (modeValues.length > 0) {
            const colorValue = modeValues[0] as RGB | RGBA;
            if ('a' in colorValue) {
              return rgbaToHex(colorValue.r, colorValue.g, colorValue.b, colorValue.a);
            } else {
              return rgbToHex(colorValue.r, colorValue.g, colorValue.b);
            }
          }
        }
        return '#000000';
      
      case 'FLOAT':
        if (variable.valuesByMode) {
          const modeValues = Object.values(variable.valuesByMode);
          if (modeValues.length > 0) {
            const floatValue = modeValues[0] as number;
            const variableType = detectVariableType(variable.name);
            
            if (variableType === 'opacity') {
              return floatValue.toString();
            } else if (variableType === 'spacing' || variableType === 'sizing' || variableType === 'border-radius') {
              return `${floatValue}px`;
            } else if (variableType === 'font-weight') {
              return Math.round(floatValue).toString();
            } else if (variableType === 'animation') {
              return `${floatValue}ms`;
            }
            
            return floatValue.toString();
          }
        }
        return '0';
      
      case 'STRING':
        if (variable.valuesByMode) {
          const modeValues = Object.values(variable.valuesByMode);
          if (modeValues.length > 0) {
            const stringValue = modeValues[0] as string;
            const variableType = detectVariableType(variable.name);
            
            if (variableType === 'font-family') {
              return `"${stringValue}"`;
            }
            
            return stringValue;
          }
        }
        return '';
      
      default:
        return '';
    }
  } catch (error) {
    console.error(`Error generating CSS value for variable ${variable.name}:`, error);
    return '';
  }
}

export function buildCSSOutput(cssVariables: Array<{name: string, value: string, type: string}>): string {
  if (cssVariables.length === 0) {
    return '/* No variables found */';
  }

  let css = ':root {\n';
  
  // Group variables by type for better organization
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
