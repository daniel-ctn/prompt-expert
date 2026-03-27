import { create } from 'zustand';
import { DEFAULT_PROMPT_SETTINGS } from '@/config/constants';
import type { PromptSettings } from '@/types';
import type { PromptBuilderInput } from '@/lib/validators/prompt';

interface PromptBuilderStore {
  role: string;
  context: string;
  task: string;
  constraints: string[];
  settings: PromptSettings;
  generatedPrompt: string;
  optimizedPrompt: string;
  isOptimizing: boolean;

  setRole: (role: string) => void;
  setContext: (context: string) => void;
  setTask: (task: string) => void;
  addConstraint: (constraint: string) => void;
  removeConstraint: (index: number) => void;
  updateConstraint: (index: number, value: string) => void;
  updateSettings: (settings: Partial<PromptSettings>) => void;
  setGeneratedPrompt: (prompt: string) => void;
  setOptimizedPrompt: (prompt: string) => void;
  setIsOptimizing: (value: boolean) => void;
  loadPreset: (preset: PromptBuilderInput) => void;
  reset: () => void;
}

const initialState = {
  role: '',
  context: '',
  task: '',
  constraints: [] as string[],
  settings: { ...DEFAULT_PROMPT_SETTINGS },
  generatedPrompt: '',
  optimizedPrompt: '',
  isOptimizing: false,
};

export const usePromptBuilderStore = create<PromptBuilderStore>((set) => ({
  ...initialState,

  setRole: (role) => set({ role }),
  setContext: (context) => set({ context }),
  setTask: (task) => set({ task }),

  addConstraint: (constraint) =>
    set((state) => ({
      constraints: [...state.constraints, constraint],
    })),

  removeConstraint: (index) =>
    set((state) => ({
      constraints: state.constraints.filter((_, i) => i !== index),
    })),

  updateConstraint: (index, value) =>
    set((state) => ({
      constraints: state.constraints.map((c, i) => (i === index ? value : c)),
    })),

  updateSettings: (partial) =>
    set((state) => ({
      settings: { ...state.settings, ...partial },
    })),

  setGeneratedPrompt: (generatedPrompt) => set({ generatedPrompt }),
  setOptimizedPrompt: (optimizedPrompt) => set({ optimizedPrompt }),
  setIsOptimizing: (isOptimizing) => set({ isOptimizing }),
  loadPreset: (preset) =>
    set({
      ...initialState,
      role: preset.role,
      context: preset.context,
      task: preset.task,
      constraints: [...preset.constraints],
      settings: { ...DEFAULT_PROMPT_SETTINGS, ...preset.settings },
    }),

  reset: () => set(initialState),
}));
