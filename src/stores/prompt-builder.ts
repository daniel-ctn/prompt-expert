import { create } from 'zustand'
import { DEFAULT_PROMPT_SETTINGS } from '@/config/constants'
import type { PromptSettings } from '@/types'
import type { PromptBuilderInput } from '@/lib/validators/prompt'
import { promptBuilderSchema } from '@/lib/validators/prompt'

export interface ValidationErrors {
  role?: string
  context?: string
  task?: string
  constraints?: string
}

interface PromptBuilderStore {
  role: string
  context: string
  task: string
  constraints: string[]
  settings: PromptSettings
  generatedPrompt: string
  optimizedPrompt: string
  isOptimizing: boolean
  errors: ValidationErrors

  setRole: (role: string) => void
  setContext: (context: string) => void
  setTask: (task: string) => void
  addConstraint: (constraint: string) => void
  removeConstraint: (index: number) => void
  updateConstraint: (index: number, value: string) => void
  updateSettings: (settings: Partial<PromptSettings>) => void
  setGeneratedPrompt: (prompt: string) => void
  setOptimizedPrompt: (prompt: string) => void
  setIsOptimizing: (value: boolean) => void
  loadPreset: (preset: PromptBuilderInput) => void
  validate: () => boolean
  clearErrors: () => void
  reset: () => void
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
  errors: {} as ValidationErrors,
}

export const usePromptBuilderStore = create<PromptBuilderStore>((set, get) => ({
  ...initialState,

  setRole: (role) =>
    set((state) => ({
      role,
      errors: state.errors.role
        ? { ...state.errors, role: undefined }
        : state.errors,
    })),
  setContext: (context) =>
    set((state) => ({
      context,
      errors: state.errors.context
        ? { ...state.errors, context: undefined }
        : state.errors,
    })),
  setTask: (task) =>
    set((state) => ({
      task,
      errors: state.errors.task
        ? { ...state.errors, task: undefined }
        : state.errors,
    })),

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

  validate: () => {
    const state = get()
    const result = promptBuilderSchema.safeParse({
      role: state.role,
      context: state.context,
      task: state.task,
      constraints: state.constraints,
      settings: state.settings,
    })

    if (result.success) {
      set({ errors: {} })
      return true
    }

    const errors: ValidationErrors = {}
    for (const issue of result.error.issues) {
      const path = issue.path[0] as string
      if (path in errors) continue
      if (
        path === 'role' ||
        path === 'context' ||
        path === 'task' ||
        path === 'constraints'
      ) {
        errors[path] = issue.message
      }
    }
    set({ errors })
    return false
  },

  clearErrors: () => set({ errors: {} }),

  reset: () => set(initialState),
}))
