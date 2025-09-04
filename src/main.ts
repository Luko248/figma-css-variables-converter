/**
 * Main plugin logic for converting Figma variables to CSS custom properties
 */
import "./types";
import { generateCSSValue, buildCSSOutput } from "./css-generator";
import { generateCSSVariableName } from "./variable-detectors";
import { pushToGitHub } from "./github-service";

// Global flag to prevent multiple executions
let isRunning = false;

/**
 * Converts Figma variables to CSS format and updates Figma web devmode
 *
 * @returns Promise with conversion results
 */
export async function convertVariablesToCSS(): Promise<{
  variables: any[];
  count: number;
}> {
  // Prevent multiple simultaneous executions
  if (isRunning) {
    console.log("⚠️ Plugin already running, ignoring duplicate call");
    throw new Error("Plugin already running");
  }

  isRunning = true;

  try {
    // Check if variables API is available
    if (!figma.variables || !figma.variables.getLocalVariableCollectionsAsync) {
      throw new Error(
        "Variables API not available. Please update Figma or check plugin permissions."
      );
    }

    const collections: VariableCollection[] =
      await figma.variables.getLocalVariableCollectionsAsync();

    if (collections.length === 0) {
      throw new Error(
        "No variable collections found! Create some variables first."
      );
    }

    console.log(`📊 Found ${collections.length} variable collection(s)`);

    /** Array to collect all processed CSS variables */
    const cssVariables: Array<{
      name: string;
      value: string;
      type: string;
      variable: Variable;
    }> = [];

    for (const collection of collections) {
      console.log(`🔍 Processing collection: ${collection.name}`);

      for (const variableId of collection.variableIds) {
        try {
          const variable: Variable = await figma.variables.getVariableByIdAsync(
            variableId
          );

          if (!variable) {
            console.warn(`⚠️ Variable with ID ${variableId} not found`);
            continue;
          }

          const cssVariableName = generateCSSVariableName(
            collection.name,
            variable.name
          );
          const cssValue = generateCSSValue(variable);

          if (cssValue) {
            cssVariables.push({
              name: cssVariableName,
              value: cssValue,
              type: variable.resolvedType.toLowerCase(),
              variable: variable,
            });

            console.log(`✅ ${cssVariableName}: ${cssValue}`);
          } else {
            console.warn(
              `⚠️ Could not generate CSS value for ${variable.name}`
            );
          }
        } catch (error) {
          console.error(`❌ Error processing variable ${variableId}:`, error);
        }
      }
    }

    if (cssVariables.length === 0) {
      throw new Error("No valid CSS variables could be generated!");
    }

    console.log(`📝 Generated ${cssVariables.length} CSS variables`);

    // Update Figma web devmode syntax (done after all processing to avoid loops)
    let syntaxUpdateCount = 0;
    try {
      for (const cssVar of cssVariables) {
        try {
          cssVar.variable.setVariableCodeSyntax("WEB", `var(${cssVar.name})`);
          syntaxUpdateCount++;
        } catch (syntaxError) {
          console.warn(
            `⚠️ Failed to set syntax for ${cssVar.name}:`,
            syntaxError
          );
        }
      }
      console.log(
        `✅ Updated Figma web syntax for ${syntaxUpdateCount}/${cssVariables.length} variables`
      );
    } catch (error) {
      console.warn("⚠️ Batch syntax update failed:", error);
    }

    // Set syntax highlighting in Figma
    figma.codegen.preferences.language = "CSS";

    console.log(`✅ Successfully converted ${cssVariables.length} variables`);

    // Return variables without the variable reference for serialization
    const serializableVariables = cssVariables.map((v) => ({
      name: v.name,
      value: v.value,
      type: v.type,
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
export async function exportToGitHub(
  variables: Array<{ name: string; value: string; type: string }>
): Promise<{ success: boolean; message: string }> {
  try {
    console.log("🚀 Starting GitHub export...");

    // Build CSS output
    const cssOutput = buildCSSOutput(variables);
    console.log("🎨 CSS Output generated:", cssOutput);

    // Push to GitHub
    const githubResult = await pushToGitHub(cssOutput);

    if (githubResult.success) {
      console.log("✅ GitHub push successful:", githubResult.message);
      return {
        success: true,
        message: `Successfully exported ${variables.length} variables`,
      };
    } else {
      console.error("❌ GitHub push failed:", githubResult.message);
      return { success: false, message: githubResult.message };
    }
  } catch (error) {
    console.error("❌ Error in GitHub export:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Loads all variable collections (read-only with current API)
 */
export async function loadCollections(): Promise<{
  collections: { id: string; name: string; variableCount: number }[];
}> {
  try {
    const collections =
      await figma.variables.getLocalVariableCollectionsAsync();

    const collectionsData = collections.map((collection) => ({
      id: collection.id,
      name: collection.name,
      variableCount: collection.variableIds.length,
    }));

    return { collections: collectionsData };
  } catch (error) {
    console.error("Error loading collections:", error);
    throw new Error("Failed to load collections");
  }
}

/**
 * Loads variables for a specific collection (by matching collection ID with variables)
 */
export async function loadVariables(collectionId: string): Promise<{
  variables: {
    id: string;
    name: string;
    resolvedType: string;
    valuesByMode: Record<string, unknown>;
  }[];
}> {
  try {
    const collections =
      await figma.variables.getLocalVariableCollectionsAsync();
    const targetCollection = collections.find((c) => c.id === collectionId);

    if (!targetCollection) {
      throw new Error("Collection not found");
    }

    const variables = [];

    for (const variableId of targetCollection.variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(variableId);
      if (variable) {
        variables.push({
          id: variable.id,
          name: variable.name,
          resolvedType: variable.resolvedType,
          valuesByMode: variable.valuesByMode,
        });
      }
    }

    return { variables };
  } catch (error) {
    console.error("Error loading variables:", error);
    throw new Error("Failed to load variables");
  }
}

/**
 * Creates a new variable collection - Currently not supported in limited API
 */
export async function createCollection(
  _name: string
): Promise<{ success: boolean; collection?: any }> {
  try {
    // The current API doesn't expose collection creation methods
    throw new Error(
      "Creating collections is not available in the current API version. Please create collections manually in Figma."
    );
  } catch (error) {
    console.error("Error creating collection:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to create collection");
  }
}

/**
 * Creates a new variable in a collection - Currently not supported in limited API
 */
export async function createVariable(
  _collectionId: string,
  _name: string,
  _type: string,
  _value: any
): Promise<{ success: boolean; variable?: any }> {
  try {
    // The current API doesn't expose variable creation methods
    throw new Error(
      "Creating variables is not available in the current API version. Please create variables manually in Figma."
    );
  } catch (error) {
    console.error("Error creating variable:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to create variable");
  }
}

/**
 * Deletes a variable collection - Currently not supported in limited API
 */
export async function deleteCollection(
  _collectionId: string
): Promise<{ success: boolean }> {
  try {
    // The current API doesn't expose collection deletion methods
    throw new Error(
      "Deleting collections is not available in the current API version. Please delete collections manually in Figma."
    );
  } catch (error) {
    console.error("Error deleting collection:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to delete collection");
  }
}

/**
 * Deletes a variable - Currently not supported in limited API
 */
export async function deleteVariable(
  _variableId: string
): Promise<{ success: boolean }> {
  try {
    // The current API doesn't expose variable deletion methods
    throw new Error(
      "Deleting variables is not available in the current API version. Please delete variables manually in Figma."
    );
  } catch (error) {
    console.error("Error deleting variable:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to delete variable");
  }
}

/**
 * Main plugin entry point with UI support
 */
function main() {
  try {
    console.log("🚀 Plugin starting...");

    // Show the UI with increased height for the new tabs
    figma.showUI(__html__, {
      width: 320,
      height: 580,
      themeColors: true,
    });

    console.log("✅ UI loaded successfully");
  } catch (error) {
    console.error("❌ Failed to initialize plugin:", error);
    figma.notify("Plugin failed to load. Check console for details.", {
      error: true,
    });
    return;
  }

  // Handle messages from UI
  figma.ui.onmessage = async (msg) => {
    const {
      type,
      variables,
      collectionId,
      name,
      variableId,
      value,
      variableType,
    } = msg;

    try {
      switch (type) {
        // Design Tokens Messages
        case "load-collections":
          try {
            const result = await loadCollections();
            figma.ui.postMessage({
              type: "collections-loaded",
              data: result,
            });
          } catch (error) {
            figma.ui.postMessage({
              type: "error",
              data: {
                message:
                  error instanceof Error
                    ? error.message
                    : "Failed to load collections",
              },
            });
          }
          break;

        case "load-variables":
          try {
            const result = await loadVariables(collectionId);
            figma.ui.postMessage({
              type: "variables-loaded",
              data: result,
            });
          } catch (error) {
            figma.ui.postMessage({
              type: "error",
              data: {
                message:
                  error instanceof Error
                    ? error.message
                    : "Failed to load variables",
              },
            });
          }
          break;

        case "create-collection":
          try {
            await createCollection(name);
            figma.ui.postMessage({
              type: "collection-created",
              data: { success: true },
            });
          } catch (error) {
            figma.ui.postMessage({
              type: "error",
              data: {
                message:
                  error instanceof Error
                    ? error.message
                    : "Failed to create collection",
              },
            });
          }
          break;

        case "create-variable":
          try {
            await createVariable(
              collectionId,
              name,
              variableType || "COLOR",
              value
            );
            figma.ui.postMessage({
              type: "variable-created",
              data: { success: true },
            });
          } catch (error) {
            figma.ui.postMessage({
              type: "error",
              data: {
                message:
                  error instanceof Error
                    ? error.message
                    : "Failed to create variable",
              },
            });
          }
          break;

        case "delete-collection":
          try {
            await deleteCollection(collectionId);
            figma.ui.postMessage({
              type: "collection-deleted",
              data: { success: true },
            });
          } catch (error) {
            figma.ui.postMessage({
              type: "error",
              data: {
                message:
                  error instanceof Error
                    ? error.message
                    : "Failed to delete collection",
              },
            });
          }
          break;

        case "delete-variable":
          try {
            await deleteVariable(variableId);
            figma.ui.postMessage({
              type: "variable-deleted",
              data: { success: true },
            });
          } catch (error) {
            figma.ui.postMessage({
              type: "error",
              data: {
                message:
                  error instanceof Error
                    ? error.message
                    : "Failed to delete variable",
              },
            });
          }
          break;

        // Converter Messages (existing functionality)
        case "convert-variables":
          try {
            const result = await convertVariablesToCSS();
            figma.ui.postMessage({
              type: "convert-success",
              data: {
                variables: result.variables,
                count: result.count,
              },
            });
          } catch (error) {
            figma.ui.postMessage({
              type: "convert-error",
              data: {
                message:
                  error instanceof Error ? error.message : "Unknown error",
              },
            });
          }
          break;

        // Exporter Messages (existing functionality)
        case "export-github":
          if (!variables) {
            figma.ui.postMessage({
              type: "export-error",
              data: { message: "No variables to export" },
            });
            return;
          }

          try {
            const result = await exportToGitHub(variables);
            if (result.success) {
              figma.ui.postMessage({
                type: "export-success",
                data: { message: result.message },
              });
            } else {
              figma.ui.postMessage({
                type: "export-error",
                data: { message: result.message },
              });
            }
          } catch (error) {
            figma.ui.postMessage({
              type: "export-error",
              data: {
                message:
                  error instanceof Error ? error.message : "Unknown error",
              },
            });
          }
          break;

        case "close-plugin":
          figma.closePlugin();
          break;

        default:
          console.warn("Unknown message type:", type);
      }
    } catch (error) {
      console.error("Error handling message:", error);
      figma.ui.postMessage({
        type: "status-update",
        data: {
          message: "An unexpected error occurred",
          type: "error",
        },
      });
    }
  };
}

// Start the plugin with UI
main();
