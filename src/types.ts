/**
 * Type definitions for Figma Plugin API and custom interfaces
 * Extends global environment with Figma-specific types and APIs
 */
declare global {
  /** Console API available in Figma plugin environment */
  const console: {
    log(...args: unknown[]): void;
    error(...args: unknown[]): void;
    warn(...args: unknown[]): void;
  };

  /** Fetch API available in Figma plugin environment */
  function fetch(
    input: string,
    init?: {
      method?: string;
      headers?: Record<string, string>;
      body?: string;
    }
  ): Promise<{
    ok: boolean;
    status: number;
    statusText: string;
    json(): Promise<unknown>;
  }>;

  /** Figma variable collection containing multiple design variables */
  interface VariableCollection {
    id: string;
    name: string;
    variableIds: string[];
  }

  /** Individual Figma design variable with type and values */
  interface Variable {
    id: string;
    name: string;
    resolvedType: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";
    valuesByMode: { [modeId: string]: RGB | RGBA | number | string | boolean };
    setVariableCodeSyntax(platform: string, syntax: string): void;
  }

  /** RGB color representation */
  interface RGB {
    r: number;
    g: number;
    b: number;
  }

  /** RGBA color with alpha channel */
  interface RGBA extends RGB {
    a: number;
  }

  /** Main Figma plugin API object */
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
    ui: {
      postMessage(message: any): void;
      onmessage: ((message: any) => void) | null;
    };
    notify(message: string, options?: { error?: boolean }): void;
    closePlugin(): void;
    showUI(
      html: string,
      options?: {
        width?: number;
        height?: number;
        themeColors?: boolean;
      }
    ): void;
  };

  /** Global variable containing the UI HTML */
  const __html__: string;
}

export {};
