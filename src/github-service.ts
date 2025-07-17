/**
 * GitHub API integration service
 */

import { GITHUB_CONFIG, GITHUB_API_BASE } from "./config";
import { base64Encode } from "./utils";

export interface GitHubCommitData {
  message: string;
  content: string;
  branch: string;
  sha?: string;
}

export interface GitHubResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

/**
 * Check if GitHub token is configured
 */
export function isGitHubTokenConfigured(): boolean {
  return GITHUB_CONFIG.token !== "YOUR_GITHUB_TOKEN_HERE";
}

/**
 * Get current file from GitHub repository
 */
export async function getCurrentFile(): Promise<{ sha: string | null; exists: boolean }> {
  const { owner, repo, path } = GITHUB_CONFIG;
  
  try {
    console.log("📥 Checking if file exists...");
    
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `token ${GITHUB_CONFIG.token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    console.log("Get file response status:", response.status);

    if (response.ok) {
      const fileData = await response.json();
      console.log("✅ File exists, will update");
      return { sha: fileData.sha, exists: true };
    } else {
      console.log("📄 File does not exist, will create new");
      return { sha: null, exists: false };
    }
  } catch (error) {
    console.log("📄 File check failed (will create new):", error);
    return { sha: null, exists: false };
  }
}

/**
 * Push content to GitHub repository
 */
export async function pushToGitHub(content: string): Promise<GitHubResponse> {
  const { owner, repo, path, branch } = GITHUB_CONFIG;

  if (!isGitHubTokenConfigured()) {
    const error = "Please add your GitHub token to the plugin configuration!";
    figma.notify(`❌ ${error}`);
    return { success: false, error };
  }

  console.log("🔄 Starting GitHub push...");
  console.log("Repository:", `${owner}/${repo}`);
  console.log("File path:", path);
  console.log("Branch:", branch);

  try {
    // Get current file info
    const { sha } = await getCurrentFile();

    // Prepare the commit data
    const commitData: GitHubCommitData = {
      message: `Update design tokens from Figma - ${new Date().toISOString()}`,
      content: base64Encode(content),
      branch: branch,
    };

    // If file exists, include SHA for update
    if (sha) {
      commitData.sha = sha;
    }

    console.log("📤 Pushing to GitHub...");

    // Push to GitHub
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_CONFIG.token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commitData),
      }
    );

    console.log("Push response status:", response.status);

    if (response.ok) {
      const result = await response.json();
      figma.notify(`✅ Successfully pushed to GitHub!`);
      console.log("✅ GitHub response:", result);
      return { success: true, data: result };
    } else {
      const errorText = await response.text();
      const error = `GitHub API error: ${response.status}`;
      figma.notify(`❌ ${error}`);
      console.error("❌ GitHub error response:", errorText);
      return { success: false, error: errorText };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const networkError = `Network error: ${errorMessage}`;
    figma.notify(`❌ ${networkError}`);
    console.error("❌ Network error details:", error);
    return { success: false, error: networkError };
  }
}
