// Variable type detection functions

export function detectVariableType(name: string): string {
  const lowerName = name.toLowerCase();
  
  // Spacing/padding detection (including pad, padinline, padblock)
  if (lowerName.includes('spacing') || lowerName.includes('space') || 
      lowerName.includes('gap') || lowerName.includes('margin') || 
      lowerName.includes('padding') || lowerName.includes('pad') ||
      /\b(xs|sm|md|lg|xl|xxl)\b/.test(lowerName)) {
    return 'spacing';
  }
  
  // Sizing detection
  if (lowerName.includes('size') || lowerName.includes('width') || 
      lowerName.includes('height') || lowerName.includes('dimension')) {
    return 'sizing';
  }
  
  // Border radius detection
  if (lowerName.includes('radius') || lowerName.includes('rounded') || 
      lowerName.includes('corner')) {
    return 'border-radius';
  }
  
  // Opacity detection
  if (lowerName.includes('opacity') || lowerName.includes('alpha') || 
      lowerName.includes('transparency')) {
    return 'opacity';
  }
  
  // Elevation/shadow detection
  if (lowerName.includes('elevation') || lowerName.includes('shadow') || 
      lowerName.includes('depth') || lowerName.includes('z-index')) {
    return 'elevation';
  }
  
  // Font family detection
  if (lowerName.includes('font') && (lowerName.includes('family') || 
      lowerName.includes('typeface'))) {
    return 'font-family';
  }
  
  // Font weight detection
  if (lowerName.includes('weight') || lowerName.includes('bold') || 
      lowerName.includes('light') || lowerName.includes('medium')) {
    return 'font-weight';
  }
  
  // Animation detection
  if (lowerName.includes('duration') || lowerName.includes('timing') || 
      lowerName.includes('animation') || lowerName.includes('transition')) {
    return 'animation';
  }
  
  return 'other';
}

export function generateCSSVariableName(_collectionName: string, variableName: string): string {
  // Detect the variable type based on the variable name
  const variableType = detectVariableType(variableName);
  
  // Convert variable type to a shortened prefix
  const typePrefix = getTypePrefix(variableType);
  
  // Clean and format the variable name
  const cleanVariable = variableName
    // Split camelCase and PascalCase
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    // Convert to lowercase
    .toLowerCase()
    // Replace spaces and special characters with hyphens
    .replace(/[^a-z0-9]/g, '-')
    // Remove duplicate hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-|-$/g, '');
  
  return `--${typePrefix}_${cleanVariable}`;
}

function getTypePrefix(variableType: string): string {
  switch (variableType) {
    case 'spacing':
      return 'space';
    case 'sizing':
      return 'size';
    case 'border-radius':
      return 'radius';
    case 'opacity':
      return 'opacity';
    case 'elevation':
      return 'elevation';
    case 'font-family':
      return 'font';
    case 'font-weight':
      return 'weight';
    case 'animation':
      return 'anim';
    case 'other':
    default:
      return 'color'; // Default to color for most variables
  }
}
