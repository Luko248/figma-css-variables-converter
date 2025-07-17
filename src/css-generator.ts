/**
 * CSS generation logic for Figma variables
 */

import { cleanVariableName, figmaColorToCSS } from "./utils";
import {
  isSpacingVariable,
  isSizingVariable,
  isBorderRadiusVariable,
  isOpacityVariable,
  isElevationVariable,
  isFontFamilyVariable,
  isFontWeightVariable,
  isAnimationVariable,
} from "./variable-detectors";

export interface ProcessedVariable {
  name: string;
  cssVarName: string;
  cssValue: string;
  resolvedType: string;
}

/**
 * Generate CSS custom property name based on variable type and name
 */
export function generateCSSVariableName(variable: Variable): string {
  const cleanName = cleanVariableName(variable.name);

  switch (variable.resolvedType) {
    case "COLOR":
      return `--color-${cleanName}`;

    case "FLOAT":
      if (isSpacingVariable(variable.name)) {
        return `--spacing-${cleanName}`;
      } else if (isSizingVariable(variable.name)) {
        return `--size-${cleanName}`;
      } else if (isBorderRadiusVariable(variable.name)) {
        return `--radius-${cleanName}`;
      } else if (isOpacityVariable(variable.name)) {
        return `--opacity-${cleanName}`;
      } else if (isElevationVariable(variable.name)) {
        return `--elevation-${cleanName}`;
      } else {
        return `--number-${cleanName}`;
      }

    case "STRING":
      if (isFontFamilyVariable(variable.name)) {
        return `--font-family-${cleanName}`;
      } else if (isFontWeightVariable(variable.name)) {
        return `--font-weight-${cleanName}`;
      } else if (isAnimationVariable(variable.name)) {
        return `--animation-${cleanName}`;
      } else {
        return `--text-${cleanName}`;
      }

    case "BOOLEAN":
      return `--boolean-${cleanName}`;

    default:
      return `--${cleanName}`;
  }
}

/**
 * Process a single variable and extract its CSS information
 */
export function processVariable(variable: Variable): ProcessedVariable {
  const cssVarName = generateCSSVariableName(variable);
  
  // Get the value for CSS export
  const modes = Object.keys(variable.valuesByMode);
  const rawValue = variable.valuesByMode[modes[0]];

  let cssValue: string;
  if (variable.resolvedType === "COLOR") {
    cssValue = figmaColorToCSS(rawValue);
  } else {
    cssValue = String(rawValue);
  }

  return {
    name: variable.name,
    cssVarName,
    cssValue,
    resolvedType: variable.resolvedType,
  };
}

/**
 * Generate CSS output from processed variables
 */
export function generateCSSOutput(processedVariables: ProcessedVariable[]): string {
  let cssOutput = ":root {\n";
  
  for (const variable of processedVariables) {
    cssOutput += `  ${variable.cssVarName}: ${variable.cssValue};\n`;
  }
  
  cssOutput += "}";
  return cssOutput;
}

/**
 * Process all variables in collections and generate CSS
 */
export async function processVariableCollections(
  collections: VariableCollection[]
): Promise<{
  cssOutput: string;
  processedVariables: ProcessedVariable[];
  totalUpdated: number;
  totalCollections: number;
}> {
  let totalUpdated = 0;
  let totalCollections = 0;
  const processedVariables: ProcessedVariable[] = [];

  for (const collection of collections) {
    totalCollections++;
    let collectionCount = 0;

    console.log(`Processing collection: ${collection.name}`);

    for (const variableId of collection.variableIds) {
      const variable: Variable | null =
        await figma.variables.getVariableByIdAsync(variableId);

      if (variable) {
        const processed = processVariable(variable);
        
        // Set the CSS syntax in Figma
        variable.setVariableCodeSyntax("WEB", processed.cssVarName);
        
        processedVariables.push(processed);
        collectionCount++;
        totalUpdated++;

        console.log(
          `Updated: ${processed.name} (${processed.resolvedType}) → ${processed.cssVarName}: ${processed.cssValue}`
        );
      }
    }

    console.log(
      `Collection "${collection.name}": ${collectionCount} variables updated`
    );
  }

  const cssOutput = generateCSSOutput(processedVariables);

  return {
    cssOutput,
    processedVariables,
    totalUpdated,
    totalCollections,
  };
}
