# Figma CSS Variables Converter

A Figma plugin that converts Figma variables to CSS custom properties and automatically pushes them to a GitHub repository.

## Features

- 🎨 Converts Figma variables to CSS custom properties
- 🔄 Automatically detects variable types (colors, spacing, sizing, etc.)
- 📤 Pushes generated CSS directly to GitHub
- 🏗️ Modular TypeScript architecture
- 🔧 Configurable GitHub integration

## Source Code Structure

The plugin uses a modular architecture with the following structure:

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

The plugin uses a JSON-based configuration system for better security and maintainability.

### Setup Instructions

1. **Create your config file**: Copy `config.example.json` to `config.json`:
   ```bash
   cp config.example.json config.json
   ```

2. **GitHub Token**: Create a personal access token at [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
   - Select "Generate new token (classic)"
   - Give it a descriptive name like "Figma Variables Plugin"
   - Select the `repo` scope for repository access
   - Copy the generated token

3. **Update Configuration**: Edit `config.json` with your settings:
   ```json
   {
     "github": {
       "owner": "your-github-username",
       "repo": "your-repository-name",
       "path": "variables.css",
       "branch": "main",
       "token": "your-github-token-here"
     }
   }
   ```

### Configuration Structure

- **`github.owner`**: Your GitHub username or organization
- **`github.repo`**: Target repository name
- **`github.path`**: File path where CSS variables will be saved
- **`github.branch`**: Target branch (usually "main" or "master")
- **`github.token`**: Your GitHub personal access token

### Security Notes

- ✅ `config.json` is automatically ignored by Git (in `.gitignore`)
- ✅ Use `config.example.json` as a template for team sharing
- ✅ Never commit your actual `config.json` with tokens to version control
- ✅ The build process injects config at compile time, keeping it secure

## Build Process

The plugin uses a JSON-based configuration system with TypeScript compilation:

1. **Config Generation**: `npm run prebuild` reads `config.json` and injects it into `code.ts`
2. **TypeScript Compilation**: Compiles everything into a single `code.js` file
3. **Single File Output**: No modules or imports - compatible with Figma's environment

```bash
npm run build    # Full build with config injection
npm run config   # Just update config in code.ts
npm run clean    # Remove generated code.js file
npm run watch    # Watch mode for development
```

## Development

### Building the Plugin

```bash
npm run build
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Watching for Changes

```bash
npm run watch
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Lukas Chylik
