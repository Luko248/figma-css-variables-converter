# Figma Variables to CSS Converter

🎨 **Automatically convert Figma design variables to CSS custom properties with proper syntax**

## Overview

This Figma plugin streamlines the design-to-development workflow by automatically converting your Figma design variables into CSS custom property format. No more manual conversion or syntax errors when exporting design tokens!

## ✨ Features

- **Batch Processing**: Converts all variables across multiple collections in one click
- **Smart Naming**: Automatically formats variable names to CSS-friendly syntax
- **Progress Tracking**: Real-time console logging and notifications
- **Error Handling**: Robust error handling with detailed feedback
- **TypeScript Support**: Fully typed for better development experience

## 🚀 What It Does

**Before:**
```
Primary/Blue/500 → (no CSS syntax)
Secondary/Red/400 → (no CSS syntax)
```

**After:**
```
Primary/Blue/500 → var(--color-primary-blue-500)
Secondary/Red/400 → var(--color-secondary-red-400)
```

## 📋 How It Works

1. Scans all local variable collections in your Figma file
2. Processes each variable and converts the name to CSS custom property format
3. Updates the web code syntax for seamless export
4. Provides detailed success/error feedback with statistics

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
Processing collection: Color Tokens
Updated: Primary/Blue/500 → var(--color-primary-blue-500)
Updated: Secondary/Red/400 → var(--color-secondary-red-400)
Collection "Color Tokens": 12 variables updated

=== CONVERSION COMPLETE ===
Total collections processed: 3
Total variables updated: 47
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
