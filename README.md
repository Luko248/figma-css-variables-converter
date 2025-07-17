# Figma Variables to CSS Converter

🎨 **Automatically convert ALL Figma design variables to CSS custom properties with intelligent category-based naming**

## Overview

This Figma plugin streamlines the design-to-development workflow by automatically converting **all types** of Figma design variables into CSS custom property format with intelligent category-based naming. Supports colors, spacing, typography, sizing, opacity, and more!

## ✨ Features

- **Universal Support**: Handles all Figma variable types (COLOR, FLOAT, STRING, BOOLEAN)
- **Intelligent Categorization**: Smart naming based on variable purpose and context
- **Batch Processing**: Converts all variables across multiple collections in one click
- **Context-Aware Naming**: Automatically detects spacing, typography, sizing, and other categories
- **Progress Tracking**: Real-time console logging and notifications
- **Error Handling**: Robust error handling with detailed feedback
- **TypeScript Support**: Fully typed for better development experience

## 🚀 What It Does

**Before:**
```
Colors/Primary/Blue/500 → (no CSS syntax)
Spacing/Large → (no CSS syntax)
Typography/Font Family/Inter → (no CSS syntax)
Border Radius/Small → (no CSS syntax)
```

**After:**
```
Colors/Primary/Blue/500 → var(--color-primary-blue-500)
Spacing/Large → var(--spacing-large)
Typography/Font Family/Inter → var(--font-family-typography-inter)
Border Radius/Small → var(--radius-border-small)
```

## 🏷️ Supported Variable Categories

| Figma Type | Detected Categories | CSS Prefix Examples |
|------------|-------------------|-------------------|
| **COLOR** | All color variables | `var(--color-*)` |
| **FLOAT** | Spacing, Sizing, Border Radius, Opacity, Elevation | `var(--spacing-*)`, `var(--size-*)`, `var(--radius-*)`, `var(--opacity-*)`, `var(--elevation-*)` |
| **STRING** | Font Family, Font Weight, Animation/Transitions | `var(--font-family-*)`, `var(--font-weight-*)`, `var(--animation-*)` |
| **BOOLEAN** | Feature flags, toggles | `var(--boolean-*)` |

## 📋 How It Works

1. Scans all local variable collections in your Figma file
2. Analyzes each variable's type and naming patterns
3. Applies intelligent categorization and CSS prefix assignment
4. Updates the web code syntax for seamless export
5. Provides detailed success/error feedback with statistics

## 🛠️ Installation & Usage

### Prerequisites
- Figma desktop app or browser version
- Basic knowledge of Figma plugins

### Setup
1. Clone this repository
2. Install dependencies: `npm install`
3. Build the plugin: `npm run build`
4. Import into Figma via Plugins → Development → Import plugin from manifest

### Usage
1. Open your Figma file with design variables
2. Run the plugin from Plugins menu
3. Watch as all your variables get converted automatically
4. Export your variables with proper CSS syntax!

## 📊 Output Example

```
Processing collection: Design Tokens
Updated: Colors/Primary/Blue/500 (COLOR) → var(--color-primary-blue-500)
Updated: Spacing/Large (FLOAT) → var(--spacing-large)
Updated: Typography/Heading/Font Family (STRING) → var(--font-family-heading)
Updated: Border Radius/Medium (FLOAT) → var(--radius-medium)
Collection "Design Tokens": 25 variables updated

=== CONVERSION COMPLETE ===
Total collections processed: 4
Total variables updated: 89
```

## 🔧 Technical Details

- **Language**: TypeScript
- **Figma API**: Uses Variables API for collection and variable management
- **Error Handling**: Comprehensive try-catch with user-friendly notifications
- **Performance**: Async/await pattern for optimal performance

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues & Support

If you encounter any issues or have feature requests, please [open an issue](../../issues) on GitHub.

---

**Made with ❤️ for the design systems community**

*Streamline your design-to-code workflow and maintain consistency across your projects!*
