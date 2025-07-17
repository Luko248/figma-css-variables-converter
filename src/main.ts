/**
 * Main orchestration logic for the Figma Variables to GitHub Plugin
 */

import { processVariableCollections } from "./css-generator";
import { pushToGitHub } from "./github-service";

/**
 * Main function to convert variables and export to GitHub
 */
export async function convertAndExportToGitHub(): Promise<void> {
  try {
    // Get all variable collections
    const collections: VariableCollection[] =
      await figma.variables.getLocalVariableCollectionsAsync();

    if (collections.length === 0) {
      figma.notify(
        "❌ No variable collections found! Create some variables first."
      );
      figma.closePlugin();
      return;
    }

    // Process all variables and generate CSS
    const result = await processVariableCollections(collections);

    console.log("\n=== GENERATED CSS ===");
    console.log(result.cssOutput);

    figma.notify(
      `🔄 Converting ${result.totalUpdated} variables and pushing to GitHub...`
    );

    // Push to GitHub
    const githubResult = await pushToGitHub(result.cssOutput);

    if (!githubResult.success) {
      figma.notify("❌ Failed to push to GitHub. Check console for details.");
    }
  } catch (error: unknown) {
    console.error("Error converting variables:", error);
    figma.notify(
      `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }

  figma.closePlugin();
}
