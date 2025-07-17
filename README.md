# Figma Variables to GitHub Plugin - Source Code Structure

This directory contains the modular source code for the Figma Variables to GitHub Plugin.

## File Structure

### `config.ts`
- **Purpose**: Configuration constants and interfaces
- **Contents**: GitHub repository settings, API endpoints
- **Key exports**: `GITHUB_CONFIG`, `GitHubConfig` interface

### `utils.ts`
- **Purpose**: Utility functions used across the plugin
- **Contents**: Base64 encoding, color conversion, string manipulation
- **Key exports**: `base64Encode()`, `figmaColorToCSS()`, `cleanVariableName()`

### `variable-detectors.ts`
- **Purpose**: Functions to detect variable types based on naming patterns
- **Contents**: Pattern matching functions for different CSS property types
- **Key exports**: `isSpacingVariable()`, `isSizingVariable()`, `isOpacityVariable()`, etc.

### `css-generator.ts`
- **Purpose**: CSS generation logic for Figma variables
- **Contents**: Variable processing, CSS naming, output generation
- **Key exports**: `generateCSSVariableName()`, `processVariable()`, `generateCSSOutput()`

### `github-service.ts`
- **Purpose**: GitHub API integration
- **Contents**: File upload, repository interaction, error handling
- **Key exports**: `pushToGitHub()`, `getCurrentFile()`, `isGitHubTokenConfigured()`

### `main.ts`
- **Purpose**: Main orchestration logic
- **Contents**: Plugin workflow coordination
- **Key exports**: `convertAndExportToGitHub()`

## Configuration

To use this plugin, update the `GITHUB_CONFIG` object in `config.ts`:

```typescript
export const GITHUB_CONFIG: GitHubConfig = {
  owner: "your-username",
  repo: "your-repo-name",
  path: "variables.css",
  branch: "main",
  token: "your-github-token-here",
};
```

## GitHub Token Setup

**Where to add your GitHub API key:**

1. Open `src/config.ts`
2. Replace `"YOUR_GITHUB_TOKEN_HERE"` with your actual GitHub personal access token
3. Make sure your token has the following permissions:
   - `repo` (for private repositories)
   - `public_repo` (for public repositories)

**How to create a GitHub token:**

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token"
3. Select appropriate scopes (repo access)
4. Copy the generated token and paste it in the config

## Build Process

The plugin uses TypeScript compilation. The main entry point is `../code.ts` which imports from this modular structure.

## Security Note

Never commit your GitHub token to version control. The `.gitignore` file is configured to help prevent accidental commits of sensitive data.
