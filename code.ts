/**
 * Figma Variables to GitHub Plugin
 * Consolidated single-file version for Figma compatibility
 */

// ===== CONFIGURATION =====
interface GitHubConfig {
  owner: string;
  repo: string;
  path: string;
  branch: string;
  token: string;
}

const GITHUB_CONFIG: GitHubConfig = {
  owner: "Luko248",
  repo: "figma-variables-test",
  path: "variables.css",
  branch: "main",
  token: "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",
};

const GITHUB_API_BASE = "https://api.github.com";

// ===== UTILITIES =====
function base64Encode(str: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let result = "";
  let i = 0;
  
  while (i < str.length) {
    const a = str.charCodeAt(i++);
    const b = i < str.length ? str.charCodeAt(i++) : 0;
    const c = i < str.length ? str.charCodeAt(i++) : 0;
    
    const bitmap = (a << 16) | (b << 8) | c;
    
    result += chars.charAt((bitmap >> 18) & 63);
    result += chars.charAt((bitmap >> 12) & 63);
    result += i - 2 < str.length ? chars.charAt((bitmap >> 6) & 63) : "=";
    result += i - 1 < str.length ? chars.charAt(bitmap & 63) : "=";
  }
  
  return result;
}

interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

function figmaColorToCSS(colorObj: string | FigmaColor | unknown): string {
  if (typeof colorObj === "string") {
    return colorObj;
  }

  if (colorObj && typeof colorObj === "object" && "r" in colorObj) {
    const color = colorObj as FigmaColor;
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);

    if (color.a !== undefined && color.a < 1) {
      return `rgba(${r}, ${g}, ${b}, ${color.a})`;
    } else {
      const toHex = (n: number) => n.toString(16).padStart(2, "0");
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
  }

  return String(colorObj);
}

function cleanVariableName(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase();
}

// ===== VARIABLE DETECTORS =====
function isSpacingVariable(name: string): boolean {
  const spacingPatterns = [
    /\bspacing\b/i,
    /\bspace\b/i,
    /\bmargin\b/i,
    /\bpadding\b/i,
    /\bgap\b/i,
    /\binset\b/i,
  ];
  return spacingPatterns.some(pattern => pattern.test(name));
}

function isSizingVariable(name: string): boolean {
  const sizingPatterns = [
    /\bsize\b/i,
    /\bwidth\b/i,
    /\bheight\b/i,
    /\bdimension\b/i,
  ];
  return sizingPatterns.some(pattern => pattern.test(name));
}

function isBorderRadiusVariable(name: string): boolean {
  const borderRadiusPatterns = [
    /\bradius\b/i,
    /\bborder-radius\b/i,
    /\brounded\b/i,
    /\bcorner\b/i,
  ];
  return borderRadiusPatterns.some(pattern => pattern.test(name));
}

function isOpacityVariable(name: string): boolean {
  const opacityPatterns = [
    /\bopacity\b/i,
    /\balpha\b/i,
    /\btransparency\b/i,
  ];
  return opacityPatterns.some(pattern => pattern.test(name));
}

function isElevationVariable(name: string): boolean {
  const elevationPatterns = [
    /\belevation\b/i,
    /\bshadow\b/i,
    /\bdrop-shadow\b/i,
    /\bbox-shadow\b/i,
  ];
  return elevationPatterns.some(pattern => pattern.test(name));
}

function isFontFamilyVariable(name: string): boolean {
  const fontFamilyPatterns = [
    /\bfont-family\b/i,
    /\bfont\b/i,
    /\btypeface\b/i,
  ];
  return fontFamilyPatterns.some(pattern => pattern.test(name));
}

function isFontWeightVariable(name: string): boolean {
  const fontWeightPatterns = [
    /\bfont-weight\b/i,
    /\bweight\b/i,
    /\bbold\b/i,
    /\blight\b/i,
    /\bregular\b/i,
    /\bmedium\b/i,
    /\bsemibold\b/i,
    /\bthin\b/i,
  ];
  return fontWeightPatterns.some(pattern => pattern.test(name));
}

function isAnimationVariable(name: string): boolean {
  const animationPatterns = [
    /\banimation\b/i,
    /\btransition\b/i,
    /\bduration\b/i,
    /\beasing\b/i,
    /\bdelay\b/i,
  ];
  return animationPatterns.some(pattern => pattern.test(name));
}

// ===== CSS GENERATOR =====
function generateCSSVariableName(variable: Variable): string {
  const cleanName = cleanVariableName(variable.name);
  
  if (variable.resolvedType === "COLOR") {
    return `--color-${cleanName}`;
  }
  
  if (isSpacingVariable(variable.name)) {
    return `--spacing-${cleanName}`;
  }
  
  if (isSizingVariable(variable.name)) {
    return `--size-${cleanName}`;
  }
  
  if (isBorderRadiusVariable(variable.name)) {
    return `--radius-${cleanName}`;
  }
  
  if (isOpacityVariable(variable.name)) {
    return `--opacity-${cleanName}`;
  }
  
  if (isElevationVariable(variable.name)) {
    return `--shadow-${cleanName}`;
  }
  
  if (isFontFamilyVariable(variable.name)) {
    return `--font-family-${cleanName}`;
  }
  
  if (isFontWeightVariable(variable.name)) {
    return `--font-weight-${cleanName}`;
  }
  
  if (isAnimationVariable(variable.name)) {
    return `--animation-${cleanName}`;
  }
  
  return `--${cleanName}`;
}

function processVariable(variable: Variable): { name: string; value: string } {
  const cssVarName = generateCSSVariableName(variable);
  
  let cssValue = "";
  
  if (variable.resolvedType === "COLOR") {
    const colorValue = variable.valuesByMode[Object.keys(variable.valuesByMode)[0]];
    cssValue = figmaColorToCSS(colorValue);
  } else if (variable.resolvedType === "FLOAT") {
    const floatValue = variable.valuesByMode[Object.keys(variable.valuesByMode)[0]];
    cssValue = `${floatValue}px`;
  } else {
    const rawValue = variable.valuesByMode[Object.keys(variable.valuesByMode)[0]];
    cssValue = String(rawValue);
  }
  
  return {
    name: cssVarName,
    value: cssValue
  };
}

function generateCSSOutput(variables: Array<{ name: string; value: string }>): string {
  if (variables.length === 0) {
    return "/* No variables found */";
  }
  
  let css = ":root {\n";
  
  variables.forEach(variable => {
    css += `  ${variable.name}: ${variable.value};\n`;
  });
  
  css += "}\n";
  
  return css;
}

// ===== GITHUB SERVICE =====
interface GitHubResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

async function getCurrentFile(): Promise<{ sha: string | null; exists: boolean }> {
  const { owner, repo, path } = GITHUB_CONFIG;
  
  try {
    console.log("📥 Checking if file exists...");
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
      {
        method: "GET",
        headers: {
          Authorization: `token ${GITHUB_CONFIG.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("✅ File exists, got SHA:", data.sha);
      return { sha: data.sha, exists: true };
    } else if (response.status === 404) {
      console.log("📄 File doesn't exist, will create new");
      return { sha: null, exists: false };
    } else {
      console.error("❌ Error checking file:", response.status, response.statusText);
      return { sha: null, exists: false };
    }
  } catch (error) {
    console.error("❌ Network error checking file:", error);
    return { sha: null, exists: false };
  }
}

async function pushToGitHub(content: string): Promise<GitHubResponse> {
  const { owner, repo, path, branch } = GITHUB_CONFIG;

  if (GITHUB_CONFIG.token === "YOUR_GITHUB_TOKEN_HERE") {
    const error = "Please add your GitHub token to the plugin configuration!";
    figma.notify(`❌ ${error}`);
    return { success: false, error };
  }

  console.log("🔄 Starting GitHub push...");
  console.log("Repository:", `${owner}/${repo}`);
  console.log("File path:", path);
  console.log("Branch:", branch);

  try {
    const { sha } = await getCurrentFile();
    const encodedContent = base64Encode(content);
    
    const requestBody = {
      message: `Update CSS variables from Figma - ${new Date().toISOString()}`,
      content: encodedContent,
      branch: branch,
      ...(sha && { sha })
    };

    console.log("📤 Pushing to GitHub...");
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_CONFIG.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Successfully pushed to GitHub!");
      console.log("📄 File URL:", data.content.html_url);
      figma.notify("✅ CSS variables successfully pushed to GitHub!");
      return { success: true, data };
    } else {
      const errorText = await response.text();
      const error = `GitHub API error: ${response.status} ${response.statusText}`;
      figma.notify(`❌ ${error}`);
      console.error("❌ GitHub error response:", errorText);
      return { success: false, error: errorText };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const networkError = `Network error: ${errorMessage}`;
    figma.notify(`❌ ${networkError}`);
    console.error("❌ Network error details:", error);
    return { success: false, error: networkError };
  }
}

// ===== MAIN FUNCTION =====
async function convertAndExportToGitHub(): Promise<void> {
  try {
    console.log("🚀 Starting Figma Variables to GitHub export...");
    
    const collections: VariableCollection[] = await figma.variables.getLocalVariableCollectionsAsync();
    
    if (collections.length === 0) {
      figma.notify("❌ No variable collections found! Create some variables first.");
      figma.closePlugin();
      return;
    }
    
    const allVariables: Array<{ name: string; value: string }> = [];
    let totalUpdated = 0;
    
    for (const collection of collections) {
      console.log(`Processing collection: ${collection.name}`);
      
      for (const variableId of collection.variableIds) {
        const variable: Variable | null = await figma.variables.getVariableByIdAsync(variableId);
        
        if (variable) {
          const cssVarName = generateCSSVariableName(variable);
          variable.setVariableCodeSyntax("WEB", cssVarName);
          
          const processedVar = processVariable(variable);
          allVariables.push(processedVar);
          
          totalUpdated++;
          console.log(`Updated: ${variable.name} → ${cssVarName}`);
        }
      }
    }
    
    const cssOutput = generateCSSOutput(allVariables);
    console.log("Generated CSS:", cssOutput);
    
    const githubResult = await pushToGitHub(cssOutput);
    
    if (githubResult.success) {
      figma.notify(`✅ Success! Updated ${totalUpdated} variables and pushed to GitHub`);
    } else {
      figma.notify(`⚠️ Variables updated but GitHub push failed: ${githubResult.error}`);
    }
    
    console.log(`\n=== CONVERSION COMPLETE ===`);
    console.log(`Total variables processed: ${totalUpdated}`);
    console.log(`GitHub push: ${githubResult.success ? 'SUCCESS' : 'FAILED'}`);
    
  } catch (error: unknown) {
    console.error("Error in main function:", error);
    figma.notify(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
  
  figma.closePlugin();
}

// Start the plugin
convertAndExportToGitHub();
