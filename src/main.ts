/**
 * Main plugin logic for converting Figma variables to CSS custom properties
 */
import './types';
import { generateCSSValue, buildCSSOutput } from './css-generator';
import { generateCSSVariableName } from './variable-detectors';
import { pushToGitHub } from './github-service';

// Global flag to prevent multiple executions
let isRunning = false;

/**
 * Converts Figma variables to CSS format and updates Figma web devmode
 * 
 * @returns Promise with conversion results
 */
export async function convertVariablesToCSS(): Promise<{variables: any[], count: number}> {
  // Prevent multiple simultaneous executions
  if (isRunning) {
    console.log('⚠️ Plugin already running, ignoring duplicate call');
    throw new Error('Plugin already running');
  }
  
  isRunning = true;
  
  try {
    const collections: VariableCollection[] = await figma.variables.getLocalVariableCollectionsAsync();
    
    if (collections.length === 0) {
      throw new Error('No variable collections found! Create some variables first.');
    }

    console.log(`📊 Found ${collections.length} variable collection(s)`);
    
    /** Array to collect all processed CSS variables */
    const cssVariables: Array<{name: string, value: string, type: string, variable: Variable}> = [];
    
    for (const collection of collections) {
      console.log(`🔍 Processing collection: ${collection.name}`);
      
      for (const variableId of collection.variableIds) {
        try {
          const variable: Variable = await figma.variables.getVariableByIdAsync(variableId);
          
          if (!variable) {
            console.warn(`⚠️ Variable with ID ${variableId} not found`);
            continue;
          }
          
          const cssVariableName = generateCSSVariableName(collection.name, variable.name);
          const cssValue = generateCSSValue(variable);
          
          if (cssValue) {
            cssVariables.push({
              name: cssVariableName,
              value: cssValue,
              type: variable.resolvedType.toLowerCase(),
              variable: variable
            });
            
            console.log(`✅ ${cssVariableName}: ${cssValue}`);
          } else {
            console.warn(`⚠️ Could not generate CSS value for ${variable.name}`);
          }
        } catch (error) {
          console.error(`❌ Error processing variable ${variableId}:`, error);
        }
      }
    }
    
    if (cssVariables.length === 0) {
      throw new Error('No valid CSS variables could be generated!');
    }
    
    console.log(`📝 Generated ${cssVariables.length} CSS variables`);
    
    // Update Figma web devmode syntax (done after all processing to avoid loops)
    let syntaxUpdateCount = 0;
    try {
      for (const cssVar of cssVariables) {
        try {
          cssVar.variable.setVariableCodeSyntax('WEB', `var(${cssVar.name})`);
          syntaxUpdateCount++;
        } catch (syntaxError) {
          console.warn(`⚠️ Failed to set syntax for ${cssVar.name}:`, syntaxError);
        }
      }
      console.log(`✅ Updated Figma web syntax for ${syntaxUpdateCount}/${cssVariables.length} variables`);
    } catch (error) {
      console.warn('⚠️ Batch syntax update failed:', error);
    }
    
    // Set syntax highlighting in Figma
    figma.codegen.preferences.language = 'CSS';
    
    console.log(`✅ Successfully converted ${cssVariables.length} variables`);
    
    // Return variables without the variable reference for serialization
    const serializableVariables = cssVariables.map(v => ({
      name: v.name,
      value: v.value,
      type: v.type
    }));
    
    return { variables: serializableVariables, count: cssVariables.length };
    
  } catch (error) {
    console.error("Error in conversion:", error);
    throw error;
  } finally {
    isRunning = false;
  }
}

/**
 * Exports CSS variables to GitHub repository
 * 
 * @param variables - Array of CSS variables to export
 * @returns Promise with export results
 */
export async function exportToGitHub(variables: Array<{name: string, value: string, type: string}>): Promise<{success: boolean, message: string}> {
  try {
    console.log('🚀 Starting GitHub export...');
    
    // Build CSS output
    const cssOutput = buildCSSOutput(variables);
    console.log('🎨 CSS Output generated:', cssOutput);
    
    // Push to GitHub
    const githubResult = await pushToGitHub(cssOutput);
    
    if (githubResult.success) {
      console.log('✅ GitHub push successful:', githubResult.message);
      return { success: true, message: `Successfully exported ${variables.length} variables` };
    } else {
      console.error('❌ GitHub push failed:', githubResult.message);
      return { success: false, message: githubResult.message };
    }
  } catch (error) {
    console.error('❌ Error in GitHub export:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Main plugin entry point with UI support
 */
function main() {
  // Show the UI
  figma.showUI(__html__, {
    width: 320,
    height: 480,
    themeColors: true
  });
  
  // Handle messages from UI
  figma.ui.onmessage = async (msg) => {
    const { type, variables } = msg;
    
    try {
      switch (type) {
        case 'convert-variables':
          try {
            const result = await convertVariablesToCSS();
            figma.ui.postMessage({
              type: 'convert-success',
              data: {
                variables: result.variables,
                count: result.count
              }
            });
          } catch (error) {
            figma.ui.postMessage({
              type: 'convert-error',
              data: {
                message: error instanceof Error ? error.message : 'Unknown error'
              }
            });
          }
          break;
        
        case 'export-github':
          if (!variables) {
            figma.ui.postMessage({
              type: 'export-error',
              data: { message: 'No variables to export' }
            });
            return;
          }
          
          try {
            const result = await exportToGitHub(variables);
            if (result.success) {
              figma.ui.postMessage({
                type: 'export-success',
                data: { message: result.message }
              });
            } else {
              figma.ui.postMessage({
                type: 'export-error',
                data: { message: result.message }
              });
            }
          } catch (error) {
            figma.ui.postMessage({
              type: 'export-error',
              data: {
                message: error instanceof Error ? error.message : 'Unknown error'
              }
            });
          }
          break;
        
        case 'close-plugin':
          figma.closePlugin();
          break;
        
        default:
          console.warn('Unknown message type:', type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      figma.ui.postMessage({
        type: 'status-update',
        data: {
          message: 'An unexpected error occurred',
          type: 'error'
        }
      });
    }
  };
}

// Start the plugin with UI
main();