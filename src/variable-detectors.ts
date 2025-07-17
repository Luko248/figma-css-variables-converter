// Variable type detection functions

export function detectVariableType(name: string): string {
  const lowerName = name.toLowerCase();
  
  // Spacing detection
  if (lowerName.includes('spacing') || lowerName.includes('space') || 
      lowerName.includes('gap') || lowerName.includes('margin') || 
      lowerName.includes('padding') || /\b(xs|sm|md|lg|xl|xxl)\b/.test(lowerName)) {
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

export function generateCSSVariableName(collectionName: string, variableName: string): string {
  const cleanCollection = collectionName.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  const cleanVariable = variableName.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  return `--${cleanCollection}-${cleanVariable}`;
}
