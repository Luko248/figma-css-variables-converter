"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Generate CSS custom property name based on variable type and name
 */
function generateCSSVariableName(variable) {
    const cleanName = variable.name.replace(/\//g, "-").toLowerCase();
    switch (variable.resolvedType) {
        case "COLOR":
            return `var(--color-${cleanName})`;
        case "FLOAT":
            // Check if it's likely a spacing/sizing value
            if (isSpacingVariable(variable.name)) {
                return `var(--spacing-${cleanName})`;
            }
            else if (isSizingVariable(variable.name)) {
                return `var(--size-${cleanName})`;
            }
            else if (isBorderRadiusVariable(variable.name)) {
                return `var(--radius-${cleanName})`;
            }
            else if (isOpacityVariable(variable.name)) {
                return `var(--opacity-${cleanName})`;
            }
            else if (isElevationVariable(variable.name)) {
                return `var(--elevation-${cleanName})`;
            }
            else {
                return `var(--number-${cleanName})`;
            }
        case "STRING":
            if (isFontFamilyVariable(variable.name)) {
                return `var(--font-family-${cleanName})`;
            }
            else if (isFontWeightVariable(variable.name)) {
                return `var(--font-weight-${cleanName})`;
            }
            else if (isAnimationVariable(variable.name)) {
                return `var(--animation-${cleanName})`;
            }
            else {
                return `var(--text-${cleanName})`;
            }
        case "BOOLEAN":
            return `var(--boolean-${cleanName})`;
        default:
            return `var(--${cleanName})`;
    }
}
/**
 * Helper functions to determine variable purpose based on naming patterns
 */
function isSpacingVariable(name) {
    const spacingKeywords = [
        "spacing",
        "margin",
        "padding",
        "gap",
        "gutter",
        "space",
    ];
    return spacingKeywords.some((keyword) => name.toLowerCase().includes(keyword));
}
function isSizingVariable(name) {
    const sizingKeywords = ["size", "width", "height", "dimension", "scale"];
    return sizingKeywords.some((keyword) => name.toLowerCase().includes(keyword));
}
function isBorderRadiusVariable(name) {
    const radiusKeywords = ["radius", "border-radius", "corner", "rounded"];
    return radiusKeywords.some((keyword) => name.toLowerCase().includes(keyword));
}
function isOpacityVariable(name) {
    const opacityKeywords = ["opacity", "alpha", "transparency"];
    return opacityKeywords.some((keyword) => name.toLowerCase().includes(keyword));
}
function isElevationVariable(name) {
    const elevationKeywords = [
        "elevation",
        "shadow",
        "depth",
        "z-index",
        "layer",
    ];
    return elevationKeywords.some((keyword) => name.toLowerCase().includes(keyword));
}
function isFontFamilyVariable(name) {
    const fontFamilyKeywords = ["font-family", "typeface", "font"];
    return fontFamilyKeywords.some((keyword) => name.toLowerCase().includes(keyword));
}
function isFontWeightVariable(name) {
    const fontWeightKeywords = [
        "font-weight",
        "weight",
        "bold",
        "light",
        "medium",
    ];
    return fontWeightKeywords.some((keyword) => name.toLowerCase().includes(keyword));
}
function isAnimationVariable(name) {
    const animationKeywords = [
        "animation",
        "transition",
        "duration",
        "timing",
        "easing",
    ];
    return animationKeywords.some((keyword) => name.toLowerCase().includes(keyword));
}
function convertVariablesToCSS() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const collections = yield figma.variables.getLocalVariableCollectionsAsync();
            if (collections.length === 0) {
                figma.notify("❌ No variable collections found! Create some variables first.");
                figma.closePlugin();
                return;
            }
            let totalUpdated = 0;
            let totalCollections = 0;
            for (const collection of collections) {
                totalCollections++;
                let collectionCount = 0;
                console.log(`Processing collection: ${collection.name}`);
                for (const variableId of collection.variableIds) {
                    const variable = yield figma.variables.getVariableByIdAsync(variableId);
                    if (variable) {
                        const cssVarName = generateCSSVariableName(variable);
                        variable.setVariableCodeSyntax("WEB", cssVarName);
                        collectionCount++;
                        totalUpdated++;
                        console.log(`Updated: ${variable.name} (${variable.resolvedType}) → ${cssVarName}`);
                    }
                }
                console.log(`Collection "${collection.name}": ${collectionCount} variables updated`);
            }
            figma.notify(`✅ Success! Updated ${totalUpdated} variables across ${totalCollections} collections`);
            console.log(`\n=== CONVERSION COMPLETE ===`);
            console.log(`Total collections processed: ${totalCollections}`);
            console.log(`Total variables updated: ${totalUpdated}`);
            console.log(`\nNow you can export your variables with proper CSS custom property syntax!`);
        }
        catch (error) {
            console.error("Error converting variables:", error);
            figma.notify(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
        figma.closePlugin();
    });
}
convertVariablesToCSS();
