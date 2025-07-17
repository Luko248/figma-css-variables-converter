const fs = require('fs');
const path = require('path');

// Read the JSON config
const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Read the code.ts file
const codeFilePath = path.join(__dirname, 'code.ts');
let codeContent = fs.readFileSync(codeFilePath, 'utf8');

// Replace the placeholder config with actual config
const configPlaceholder = /const CONFIG: Config = \{[\s\S]*?\};/;
const newConfig = `const CONFIG: Config = ${JSON.stringify(config, null, 2)};`;

codeContent = codeContent.replace(configPlaceholder, newConfig);

// Write the updated code.ts
fs.writeFileSync(codeFilePath, codeContent);

console.log('✅ Config injected successfully into code.ts from config.json');
