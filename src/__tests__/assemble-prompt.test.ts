import { describe, it, expect } from 'vitest';

vi.mock('@ai-sdk/openai', () => ({ createOpenAI: () => () => ({}) }));
vi.mock('@ai-sdk/google', () => ({
  createGoogleGenerativeAI: () => () => ({}),
}));

import { vi } from 'vitest';
import { assemblePrompt } from '@/lib/ai';

describe('assemblePrompt', () => {
  it('builds a minimal prompt with just a task', () => {
    const result = assemblePrompt({
      role: '',
      context: '',
      task: 'Summarize this article',
      constraints: [],
      tone: '',
      outputFormat: 'text',
      includeExamples: false,
    });
    expect(result).toContain('Task:');
    expect(result).toContain('Summarize this article');
    expect(result).not.toContain('You are');
  });

  it('includes role when provided', () => {
    const result = assemblePrompt({
      role: 'a helpful assistant',
      context: '',
      task: 'Answer questions',
      constraints: [],
      tone: '',
      outputFormat: 'text',
      includeExamples: false,
    });
    expect(result).toContain('You are a helpful assistant.');
  });

  it('includes constraints as a bulleted list', () => {
    const result = assemblePrompt({
      role: '',
      context: '',
      task: 'Write code',
      constraints: ['Use TypeScript', 'Follow best practices'],
      tone: '',
      outputFormat: 'text',
      includeExamples: false,
    });
    expect(result).toContain('- Use TypeScript');
    expect(result).toContain('- Follow best practices');
  });

  it('adds output format instructions for JSON', () => {
    const result = assemblePrompt({
      role: '',
      context: '',
      task: 'List items',
      constraints: [],
      tone: '',
      outputFormat: 'json',
      includeExamples: false,
    });
    expect(result).toContain('Respond in valid JSON format.');
  });
});
