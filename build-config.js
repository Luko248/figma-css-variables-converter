const fs = require('fs');
const path = require('path');

// Read the JSON config
const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Read the src/config.ts file
const configFilePath = path.join(__dirname, 'src', 'config.ts');
let configContent = fs.readFileSync(configFilePath, 'utf8');

// Replace the placeholder config with actual config
const configPlaceholder = /export const CONFIG: Config = \{[\s\S]*?\};/;
const newConfig = `export const CONFIG: Config = ${JSON.stringify(config, null, 2)};`;

configContent = configContent.replace(configPlaceholder, newConfig);

// Write the updated src/config.ts
fs.writeFileSync(configFilePath, configContent);

console.log('✅ Config injected successfully into src/config.ts from config.json');
