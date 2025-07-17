// Configuration loaded from config.json
export interface GitHubConfig {
  owner: string;
  repo: string;
  path: string;
  branch: string;
  token: string;
}

export interface Config {
  github: GitHubConfig;
  api: {
    githubBase: string;
  };
  plugin: {
    name: string;
    version: string;
  };
}

// This will be replaced with actual config during build
export const CONFIG: Config = {
  github: {
    owner: "Luko248",
    repo: "figma-variables-test",
    path: "variables.css",
    branch: "main",
    token: "",
  },
  api: {
    githubBase: "https://api.github.com",
  },
  plugin: {
    name: "Figma Variables to GitHub",
    version: "1.0.0",
  },
};

export const GITHUB_CONFIG = CONFIG.github;
export const GITHUB_API_BASE = CONFIG.api.githubBase;
