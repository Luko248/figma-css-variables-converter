/**
 * Main plugin logic for converting Figma variables to CSS custom properties
 */
import './types';
import { generateCSSValue, buildCSSOutput } from './css-generator';
import { generateCSSVariableName } from './variable-detectors';
import { pushToGitHub } from './github-service';

/**
 * Main function that orchestrates the conversion of Figma variables to CSS
 * and pushes the result to GitHub
 * 
 * @returns Promise that resolves when the conversion and upload is complete
 */
export async function convertVariablesToCSS(): Promise<void> {
  try {
    const collections: VariableCollection[] = await figma.variables.getLocalVariableCollectionsAsync();
    
    if (collections.length === 0) {
      figma.notify("❌ No variable collections found! Create some variables first.");
      figma.closePlugin();
      return;
    }

    console.log(`📊 Found ${collections.length} variable collection(s)`);
    
    /** Array to collect all processed CSS variables */
    const cssVariables: Array<{name: string, value: string, type: string}> = [];
    
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
              type: variable.resolvedType.toLowerCase()
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
      figma.notify("❌ No valid CSS variables could be generated!");
      figma.closePlugin();
      return;
    }
    
    console.log(`📝 Generated ${cssVariables.length} CSS variables`);
    
    // Set syntax highlighting in Figma
    figma.codegen.preferences.language = 'CSS';
    
    // Build CSS output
    const cssOutput = buildCSSOutput(cssVariables);
    console.log('🎨 CSS Output generated:', cssOutput);
    
    // Push to GitHub
    console.log('🚀 Pushing to GitHub...');
    const githubResult = await pushToGitHub(cssOutput);
    
    if (githubResult.success) {
      figma.notify(`✅ Success! ${cssVariables.length} variables pushed to GitHub`);
      console.log('✅ GitHub push successful:', githubResult.message);
    } else {
      figma.notify(`❌ GitHub Error: ${githubResult.message}`);
      console.error('❌ GitHub push failed:', githubResult.message);
    }
    
    console.log(`GitHub push: ${githubResult.success ? 'SUCCESS' : 'FAILED'}`);
    
  } catch (error) {
    console.error("Error in main function:", error);
    figma.notify(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
  
  figma.closePlugin();
}

// Start the plugin
convertVariablesToCSS();
