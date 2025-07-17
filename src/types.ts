// Figma API type definitions
declare global {
  // Global console for Figma plugin environment
  const console: {
    log(...args: unknown[]): void;
    error(...args: unknown[]): void;
    warn(...args: unknown[]): void;
  };

  // Global fetch for Figma plugin environment
  function fetch(input: string, init?: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
  }): Promise<{
    ok: boolean;
    status: number;
    statusText: string;
    json(): Promise<unknown>;
  }>;

  interface VariableCollection {
    id: string;
    name: string;
    variableIds: string[];
  }

  interface Variable {
    id: string;
    name: string;
    resolvedType: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
    valuesByMode: { [modeId: string]: RGB | RGBA | number | string | boolean };
  }

  interface RGB {
    r: number;
    g: number;
    b: number;
  }

  interface RGBA extends RGB {
    a: number;
  }

  const figma: {
    variables: {
      getLocalVariableCollectionsAsync(): Promise<VariableCollection[]>;
      getVariableByIdAsync(id: string): Promise<Variable>;
    };
    codegen: {
      preferences: {
        language: string;
      };
    };
    notify(message: string): void;
    closePlugin(): void;
  };
}

export {};
