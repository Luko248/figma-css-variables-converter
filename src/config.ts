/**
 * Configuration for the Figma Variables to GitHub Plugin
 */

export interface GitHubConfig {
  owner: string;
  repo: string;
  path: string;
  branch: string;
  token: string;
}

// GitHub configuration - UPDATE THESE VALUES
export const GITHUB_CONFIG: GitHubConfig = {
  owner: "Luko248",
  repo: "figma-variables-test",
  path: "variables.css",
  branch: "main",
  token: "YOUR_GITHUB_TOKEN_HERE", // Replace with your token
};

export const GITHUB_API_BASE = "https://api.github.com";
