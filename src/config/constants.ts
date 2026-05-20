import type {
  AIModel,
  AIProvider,
  OutputFormat,
  PromptCategory,
  ToneStyle,
} from '@/types'

export const APP_NAME = 'Prompt Expert'
export const APP_DESCRIPTION =
  'Create efficient, optimized prompts for any AI model'

export const AI_MODELS: {
  value: AIModel
  label: string
  provider: AIProvider
}[] = [
  { value: 'gpt-5.4-mini', label: 'GPT-5.4 Mini', provider: 'openai' },
  {
    value: 'gemini-3-flash-preview',
    label: 'Gemini 3 Flash',
    provider: 'google',
  },
  {
    value: 'claude-haiku-4-5-20251001',
    label: 'Claude Haiku 4.5',
    provider: 'anthropic',
  },
]

export const PROMPT_CATEGORIES: {
  value: PromptCategory
  label: string
  description: string
}[] = [
  {
    value: 'instruction',
    label: 'Instruction',
    description: 'Step-by-step tasks and commands',
  },
  {
    value: 'creative',
    label: 'Creative',
    description: 'Writing, brainstorming, and ideation',
  },
  {
    value: 'code',
    label: 'Code',
    description: 'Programming and technical tasks',
  },
  {
    value: 'design',
    label: 'Design',
    description: 'AI design tools, UI briefs, and visual direction',
  },
  {
    value: 'agent',
    label: 'Agent',
    description: 'Coding agents, scaffolding, and implementation plans',
  },
  {
    value: 'analysis',
    label: 'Analysis',
    description: 'Data analysis and interpretation',
  },
  {
    value: 'qa',
    label: 'Q&A',
    description: 'Question answering and information retrieval',
  },
  {
    value: 'conversation',
    label: 'Conversation',
    description: 'Dialogue and chat interactions',
  },
]

export const TONE_STYLES: { value: ToneStyle; label: string }[] = [
  { value: 'formal', label: 'Formal' },
  { value: 'casual', label: 'Casual' },
  { value: 'technical', label: 'Technical' },
  { value: 'creative', label: 'Creative' },
  { value: 'concise', label: 'Concise' },
  { value: 'detailed', label: 'Detailed' },
]

export const OUTPUT_FORMATS: { value: OutputFormat; label: string }[] = [
  { value: 'text', label: 'Plain Text' },
  { value: 'json', label: 'JSON' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'list', label: 'Bullet List' },
  { value: 'code', label: 'Code Block' },
  { value: 'table', label: 'Table' },
]

export const MODEL_RECOMMENDATIONS: Record<
  PromptCategory,
  { model: AIModel; reason: string }
> = {
  instruction: {
    model: 'gpt-5.4-mini',
    reason: 'Fast and precise for step-by-step instructions',
  },
  creative: {
    model: 'claude-haiku-4-5-20251001',
    reason: 'Fast and cost-efficient for creative writing',
  },
  code: {
    model: 'gpt-5.4-mini',
    reason: 'Top-tier code generation and understanding',
  },
  design: {
    model: 'claude-haiku-4-5-20251001',
    reason: 'Fast at product direction, UI language, and creative briefs',
  },
  agent: {
    model: 'gpt-5.4-mini',
    reason: 'Strong at structured project plans and coding-agent instructions',
  },
  analysis: {
    model: 'gemini-3-flash-preview',
    reason: 'Strong analytical reasoning with large context',
  },
  qa: {
    model: 'gpt-5.4-mini',
    reason: 'Fast, accurate responses for Q&A tasks',
  },
  conversation: {
    model: 'gemini-3-flash-preview',
    reason: 'Natural, empathetic conversational tone',
  },
}

export const DEFAULT_PROMPT_SETTINGS = {
  model: 'gpt-5.4-mini' as AIModel,
  category: 'instruction' as PromptCategory,
  tone: 'formal' as ToneStyle,
  outputFormat: 'text' as OutputFormat,
  includeExamples: false,
  temperature: 0.7,
} as const

export const PROMPT_TEMPLATES: {
  id: string
  label: string
  category: PromptCategory
  role: string
  context: string
  task: string
  constraints: string[]
  tone: ToneStyle
  outputFormat: OutputFormat
}[] = [
  {
    id: 'code-review',
    label: 'Code Review',
    category: 'code',
    role: 'a senior software engineer performing a thorough code review',
    context: 'You are reviewing a pull request for a production codebase.',
    task: 'Review the provided code for bugs, performance issues, security vulnerabilities, and adherence to best practices. Suggest specific improvements.',
    constraints: [
      'Focus on actionable feedback, not style preferences',
      'Flag any security concerns as high priority',
      'Suggest concrete code improvements with examples',
    ],
    tone: 'technical',
    outputFormat: 'markdown',
  },
  {
    id: 'blog-post',
    label: 'Blog Post Writer',
    category: 'creative',
    role: 'a professional content writer specializing in engaging blog articles',
    context:
      'You are writing for a tech-savvy audience that values clarity and depth.',
    task: 'Write a well-structured blog post on the given topic. Include an attention-grabbing introduction, clear sections with subheadings, and a compelling conclusion.',
    constraints: [
      'Keep paragraphs concise (3-4 sentences max)',
      'Include relevant examples or analogies',
      'End with a clear call-to-action',
    ],
    tone: 'casual',
    outputFormat: 'markdown',
  },
  {
    id: 'data-analysis',
    label: 'Data Analysis',
    category: 'analysis',
    role: 'a data analyst with expertise in statistical interpretation',
    context:
      'You are analyzing a dataset to extract actionable insights for business stakeholders.',
    task: 'Analyze the provided data, identify key trends, outliers, and correlations. Present findings with clear explanations suitable for non-technical decision makers.',
    constraints: [
      'Quantify findings with specific numbers and percentages',
      'Highlight the top 3 most important insights',
      'Suggest next steps based on the analysis',
    ],
    tone: 'formal',
    outputFormat: 'table',
  },
  {
    id: 'api-documentation',
    label: 'API Documentation',
    category: 'instruction',
    role: 'a technical writer specializing in API documentation',
    context:
      'You are documenting a REST API for developers integrating with the service.',
    task: 'Create comprehensive API documentation for the given endpoint, including request/response formats, authentication, error codes, and usage examples.',
    constraints: [
      'Include request and response examples in JSON',
      'Document all possible error responses',
      'Add rate limiting and authentication details',
    ],
    tone: 'technical',
    outputFormat: 'markdown',
  },
  {
    id: 'ai-design-tool-brief',
    label: 'AI Design Tool Brief',
    category: 'design',
    role: 'a senior product designer writing an execution-ready prompt for an AI design tool',
    context:
      'You are preparing a prompt for Claude Design, v0, Figma AI, or a similar AI design tool. The tool should generate a usable interface, not a marketing description.',
    task: 'Create a detailed design-generation prompt for the requested product, feature, or screen. Define the user, workflow, layout, visual style, components, states, responsive behavior, and accessibility expectations.',
    constraints: [
      'Specify the actual UI to generate, including primary screens and important states',
      'Use the project design system or named visual direction when provided',
      'Avoid vague adjectives unless they are tied to concrete UI decisions',
      'Include copy, component behavior, and responsive requirements',
      'Ask the design tool for production-ready structure, not a concept image',
    ],
    tone: 'technical',
    outputFormat: 'markdown',
  },
  {
    id: 'project-scaffold-agent',
    label: 'Project Scaffold Agent',
    category: 'agent',
    role: 'a senior software architect writing a precise project scaffolding prompt for Claude Code, Codex, or Cursor',
    context:
      'You are preparing instructions for a coding agent to initialize a new software project from scratch.',
    task: 'Generate a complete scaffolding prompt that tells the coding agent what to build, which stack to use, how to structure files, which commands to run, what environment variables are needed, and how to verify the result.',
    constraints: [
      'Include a clear project goal, target users, and non-goals',
      'Specify package manager, framework, language, styling, testing, and deployment assumptions',
      'Define the expected file structure and key implementation milestones',
      'Include acceptance criteria and verification commands',
      'Tell the coding agent to keep changes minimal, consistent, and fully tested',
    ],
    tone: 'technical',
    outputFormat: 'markdown',
  },
  {
    id: 'coding-agent-task',
    label: 'Coding Agent Task',
    category: 'agent',
    role: 'a technical lead writing a scoped implementation prompt for a coding agent',
    context:
      'You are preparing a task prompt for Claude Code, Codex, Cursor, or another coding agent working in an existing repository.',
    task: 'Write a coding-agent prompt that explains the desired change, relevant context, files or areas to inspect, constraints, success criteria, and verification steps.',
    constraints: [
      'State assumptions and open questions before implementation',
      'Keep the requested change surgical and avoid unrelated refactors',
      'Define expected behavior and edge cases',
      'Require tests or verification appropriate to the risk',
      'Ask for a concise implementation summary with changed files',
    ],
    tone: 'technical',
    outputFormat: 'markdown',
  },
  {
    id: 'qa-assistant',
    label: 'Q&A Knowledge Base',
    category: 'qa',
    role: 'a knowledgeable assistant that answers questions accurately and helpfully',
    context:
      'You are helping users find answers from a knowledge base or domain-specific information.',
    task: "Answer the user's question thoroughly and accurately. If the answer is uncertain, clearly state the level of confidence and suggest where to find authoritative information.",
    constraints: [
      'Cite sources when possible',
      'If unsure, say so rather than guessing',
      'Provide step-by-step explanations for complex topics',
    ],
    tone: 'detailed',
    outputFormat: 'text',
  },
  {
    id: 'customer-support',
    label: 'Customer Support Agent',
    category: 'conversation',
    role: 'a friendly and efficient customer support representative',
    context: 'You are handling customer inquiries for a SaaS product.',
    task: 'Help the customer resolve their issue or answer their question. Be empathetic, provide clear solutions, and escalate when needed.',
    constraints: [
      "Always acknowledge the customer's concern first",
      'Provide step-by-step solutions when applicable',
      'Offer to follow up if the issue is not resolved',
    ],
    tone: 'casual',
    outputFormat: 'text',
  },
]
