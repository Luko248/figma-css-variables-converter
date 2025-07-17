const fs = require('fs');
const path = require('path');

// Read the generated code.js file
const codeFilePath = path.join(__dirname, 'code.js');

if (!fs.existsSync(codeFilePath)) {
  console.log('⚠️ code.js not found, skipping Figma compatibility fix');
  process.exit(0);
}

let codeContent = fs.readFileSync(codeFilePath, 'utf8');

// Replace the problematic __dirname reference
const originalContent = codeContent;
codeContent = codeContent.replace(
  /if \(typeof __nccwpck_require__ !== 'undefined'\) __nccwpck_require__\.ab = __dirname \+ "\/";/g,
  'if (typeof __nccwpck_require__ !== \'undefined\') __nccwpck_require__.ab = "";'
);

// Remove module.exports at the end since Figma doesn't support CommonJS
codeContent = codeContent.replace(
  /module\.exports = __webpack_exports__;\s*\/\*\*\*\*\*\*\/\s*\}\)\(\)\s*;?\s*$/,
  '/******/ })()'  
);

// Add module and exports globals at the beginning for webpack runtime compatibility
if (!codeContent.includes('var module = ') && !codeContent.includes('var exports = ')) {
  codeContent = '// Figma compatibility: Define module and exports globals\n' +
                'var module = { exports: {} };\n' +
                'var exports = module.exports;\n\n' +
                codeContent;
}

// Check if any replacements were made
if (originalContent !== codeContent) {
  // Write the fixed code back
  fs.writeFileSync(codeFilePath, codeContent);
  console.log('✅ Fixed Figma compatibility issues in code.js (__dirname and module.exports removed)');
} else {
  console.log('ℹ️ No Figma compatibility issues found in code.js');
}
