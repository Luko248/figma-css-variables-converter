# Figma CSS Variables Converter

A Figma plugin that converts Figma variables to development-friendly CSS custom properties and automatically pushes them to a GitHub repository.

## Core Functionality

### 1. 🎯 **Figma Dev Mode Integration**

The plugin updates Figma's web/devmode to display properly formatted CSS variable names:

- **Before:** Generic variable display
- **After:** Shows `var(--color_btn-bg)`, `var(--space_btn-pad-inline)` format
- **Benefit:** Developers see the exact CSS variable names they need to use in their code

### 2. 📤 **GitHub CSS Export**

Automatically generates and exports a complete CSS file to your GitHub repository:

- **Format:** Modern CSS custom properties with semantic naming
- **Output:** Clean, organized CSS file with proper grouping and comments
- **Integration:** Direct push to specified GitHub repo/branch/file

## Features

- 🎨 **Modern CSS Format:** HSL colors (`hsl(0 100% 50%)`) with decimal alpha (`hsl(0 100% 50% / .5)`)
- 📏 **Rem Units:** All sizes converted to rem units (16px base: `1rem`, `0.5rem`, etc.)
- 🏷️ **Smart Naming:** Semantic variable names with type prefixes (`--color_btn-bg`, `--space_btn-pad-inline`)
- 🔄 **Auto Type Detection:** Detects spacing, sizing, colors, border-radius, opacity, fonts, etc.
- 🎭 **CamelCase Conversion:** Converts `btnBg` to `btn-bg` for consistent naming
- 📤 **GitHub Integration:** Direct push to repository with commit messages
- 🏗️ **Clean Architecture:** Modular TypeScript with lambda functions
- 🔧 **Secure Configuration:** JSON-based config with token management

## Example Output

### Generated CSS Format:

```css
:root {
  /* Color Variables */
  --color_btn-bg: hsl(0 100% 50%);
  --color_btn-text: hsl(0 0% 100%);
  --color_primary: hsl(220 100% 50% / 0.9);

  /* Space Variables */
  --space_btn-pad-inline: 1rem;
  --space_btn-pad-block: 0.5rem;
  --space_container-gap: 1.5rem;

  /* Radius Variables */
  --radius_btn-radius: 0.25rem;
  --radius_card-radius: 0.5rem;

  /* Size Variables */
  --size_btn-height: 2.5rem;
  --size_icon-size: 1.5rem;
}
```

### Figma Dev Mode Display:

- **btnBg** → `var(--color_btn-bg)`
- **btnPadInline** → `var(--space_btn-pad-inline)`
- **btnRadius** → `var(--radius_btn-radius)`

## Source Code Structure

The plugin uses a modular architecture with lambda functions and clean separation of concerns:

### `utils.ts`

- **HSL Color Conversion:** `rgbToHsl()`, `rgbaToHsl()` with decimal alpha
- **Unit Conversion:** `pxToRem()` for consistent rem units
- **GitHub Integration:** `base64Encode()` for API compatibility

### `variable-detectors.ts`

- **Smart Type Detection:** Lambda functions for detecting variable purposes
- **Semantic Naming:** `generateCSSVariableName()` with camelCase conversion
- **Type Mapping:** Clean prefix mapping for CSS variable categories

### `css-generator.ts`

- **Value Conversion:** Type-specific CSS value generation
- **Output Formatting:** Organized CSS with proper grouping and comments
- **Modern Syntax:** HSL colors, rem units, decimal alpha support

### `github-service.ts`

- **Repository Integration:** File upload with conflict resolution
- **Error Handling:** Comprehensive API error management
- **Security:** Token masking and secure authentication

### `main.ts`

- **Workflow Orchestration:** Complete plugin lifecycle management
- **Figma Integration:** Dev mode syntax updates with `setVariableCodeSyntax()`
- **User Feedback:** Progressive notifications for better UX

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
       "path": "your-file-path.css",
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

The plugin uses a modern modular build process with secure configuration injection:

1. **Modular Structure**: Source code is organized in the `src/` directory with separate modules
2. **Config Injection**: `npm run prebuild` reads `config.json` and injects it into `src/config.ts`
3. **Bundling**: `npm run build` uses `@vercel/ncc` to bundle all TypeScript modules into a single `code.js` file
4. **Single File Output**: The build creates a single `code.js` file compatible with Figma's plugin environment

### Source Structure

```
src/
├── main.ts              # Main plugin entry point
├── config.ts            # Configuration (injected from config.json)
├── types.ts             # Figma API type definitions
├── utils.ts             # Utility functions (base64, color conversion)
├── variable-detectors.ts # Variable type detection and naming
├── css-generator.ts     # CSS generation logic
└── github-service.ts    # GitHub API integration
```

### Available Scripts

- `npm run build` - Full build (config injection + bundling)
- `npm run prebuild` - Only inject config from JSON into TypeScript
- `npm run config` - Alias for prebuild (config injection only)
- `npm run clean` - Remove generated `code.js` file and build artifacts
- `npm run watch` - Watch mode for development with auto-rebuild

### Development Workflow

1. Edit source files in the `src/` directory
2. Run `npm run build` to bundle everything into `code.js`
3. Test the plugin in Figma
4. Use `npm run watch` for continuous development
5. Use `npm run clean` to remove generated files when needed

## Variable Format Examples

| Figma Variable    | CSS Variable Name              | CSS Value Example   |
| ----------------- | ------------------------------ | ------------------- |
| `btnBg`           | `--color_btn-bg`               | `hsl(220 100% 50%)` |
| `btnText`         | `--color_btn-text`             | `hsl(0 0% 100%)`    |
| `btnPadInline`    | `--space_btn-pad-inline`       | `1rem`              |
| `btnPadBlock`     | `--space_btn-pad-block`        | `0.5rem`            |
| `btnRadius`       | `--radius_btn-radius`          | `0.25rem`           |
| `primaryOpacity`  | `--opacity_primary-opacity`    | `0.9`               |
| `shadowElevation` | `--elevation_shadow-elevation` | `0.5rem`            |

## Usage Notifications

When the plugin runs, you'll see two notifications:

1. **"✅ X variables converted to development-friendly format"** - Figma dev mode updated
2. **"✅ Success! X variables pushed to GitHub"** - CSS file exported to repository

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

## Technical Highlights

- **Lambda Functions:** Clean, functional programming approach
- **Type Safety:** Comprehensive TypeScript interfaces
- **Single Bundle:** 19KB optimized output for Figma
- **Modern CSS:** HSL colors, rem units, semantic naming
- **Error Handling:** Robust error management and user feedback
- **Security:** Secure token handling and Git integration

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Lukas Chylik
