import { describe, it, expect } from 'vitest';
import {
  extractVariables,
  resolveVariables,
} from '@/components/prompt-builder/variable-filler';

describe('extractVariables', () => {
  it('extracts unique variable names', () => {
    const text = 'Hello {{name}}, welcome to {{city}}. Your name is {{name}}.';
    expect(extractVariables(text)).toEqual(['name', 'city']);
  });

  it('returns empty array for no variables', () => {
    expect(extractVariables('No variables here')).toEqual([]);
  });

  it('trims whitespace inside braces', () => {
    expect(extractVariables('{{ spaced }}')).toEqual(['spaced']);
  });
});

describe('resolveVariables', () => {
  it('replaces variables with values', () => {
    const text = 'Hello {{name}}, you live in {{city}}.';
    const result = resolveVariables(text, { name: 'Alice', city: 'Paris' });
    expect(result).toBe('Hello Alice, you live in Paris.');
  });

  it('keeps unresolved variables as-is', () => {
    const result = resolveVariables('Hi {{name}}', {});
    expect(result).toBe('Hi {{name}}');
  });
});
