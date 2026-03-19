import type {
  AIModel,
  AIProvider,
  OutputFormat,
  PromptCategory,
  ToneStyle,
} from "@/types";

export const APP_NAME = "Prompt Expert";
export const APP_DESCRIPTION =
  "Create efficient, optimized prompts for any AI model";

export const AI_MODELS: { value: AIModel; label: string; provider: AIProvider }[] = [
  { value: "gpt-4.1", label: "GPT-4.1", provider: "openai" },
  { value: "gpt-4.1-mini", label: "GPT-4.1 Mini", provider: "openai" },
  { value: "claude-opus-4-6", label: "Claude Opus 4.6", provider: "anthropic" },
  { value: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", provider: "anthropic" },
  { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro", provider: "google" },
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash", provider: "google" },
];

export const PROMPT_CATEGORIES: { value: PromptCategory; label: string; description: string }[] = [
  { value: "instruction", label: "Instruction", description: "Step-by-step tasks and commands" },
  { value: "creative", label: "Creative", description: "Writing, brainstorming, and ideation" },
  { value: "code", label: "Code", description: "Programming and technical tasks" },
  { value: "analysis", label: "Analysis", description: "Data analysis and interpretation" },
  { value: "qa", label: "Q&A", description: "Question answering and information retrieval" },
  { value: "conversation", label: "Conversation", description: "Dialogue and chat interactions" },
];

export const TONE_STYLES: { value: ToneStyle; label: string }[] = [
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "technical", label: "Technical" },
  { value: "creative", label: "Creative" },
  { value: "concise", label: "Concise" },
  { value: "detailed", label: "Detailed" },
];

export const OUTPUT_FORMATS: { value: OutputFormat; label: string }[] = [
  { value: "text", label: "Plain Text" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
  { value: "list", label: "Bullet List" },
  { value: "code", label: "Code Block" },
  { value: "table", label: "Table" },
];

export const DEFAULT_PROMPT_SETTINGS = {
  model: "gpt-4.1-mini" as AIModel,
  category: "instruction" as PromptCategory,
  tone: "formal" as ToneStyle,
  outputFormat: "text" as OutputFormat,
  includeExamples: false,
  temperature: 0.7,
} as const;

export const PROMPT_TEMPLATES: {
  id: string;
  label: string;
  category: PromptCategory;
  role: string;
  context: string;
  task: string;
  constraints: string[];
  tone: ToneStyle;
  outputFormat: OutputFormat;
}[] = [
  {
    id: "code-review",
    label: "Code Review",
    category: "code",
    role: "a senior software engineer performing a thorough code review",
    context: "You are reviewing a pull request for a production codebase.",
    task: "Review the provided code for bugs, performance issues, security vulnerabilities, and adherence to best practices. Suggest specific improvements.",
    constraints: [
      "Focus on actionable feedback, not style preferences",
      "Flag any security concerns as high priority",
      "Suggest concrete code improvements with examples",
    ],
    tone: "technical",
    outputFormat: "markdown",
  },
  {
    id: "blog-post",
    label: "Blog Post Writer",
    category: "creative",
    role: "a professional content writer specializing in engaging blog articles",
    context: "You are writing for a tech-savvy audience that values clarity and depth.",
    task: "Write a well-structured blog post on the given topic. Include an attention-grabbing introduction, clear sections with subheadings, and a compelling conclusion.",
    constraints: [
      "Keep paragraphs concise (3-4 sentences max)",
      "Include relevant examples or analogies",
      "End with a clear call-to-action",
    ],
    tone: "casual",
    outputFormat: "markdown",
  },
  {
    id: "data-analysis",
    label: "Data Analysis",
    category: "analysis",
    role: "a data analyst with expertise in statistical interpretation",
    context: "You are analyzing a dataset to extract actionable insights for business stakeholders.",
    task: "Analyze the provided data, identify key trends, outliers, and correlations. Present findings with clear explanations suitable for non-technical decision makers.",
    constraints: [
      "Quantify findings with specific numbers and percentages",
      "Highlight the top 3 most important insights",
      "Suggest next steps based on the analysis",
    ],
    tone: "formal",
    outputFormat: "table",
  },
  {
    id: "api-documentation",
    label: "API Documentation",
    category: "instruction",
    role: "a technical writer specializing in API documentation",
    context: "You are documenting a REST API for developers integrating with the service.",
    task: "Create comprehensive API documentation for the given endpoint, including request/response formats, authentication, error codes, and usage examples.",
    constraints: [
      "Include request and response examples in JSON",
      "Document all possible error responses",
      "Add rate limiting and authentication details",
    ],
    tone: "technical",
    outputFormat: "markdown",
  },
  {
    id: "qa-assistant",
    label: "Q&A Knowledge Base",
    category: "qa",
    role: "a knowledgeable assistant that answers questions accurately and helpfully",
    context: "You are helping users find answers from a knowledge base or domain-specific information.",
    task: "Answer the user's question thoroughly and accurately. If the answer is uncertain, clearly state the level of confidence and suggest where to find authoritative information.",
    constraints: [
      "Cite sources when possible",
      "If unsure, say so rather than guessing",
      "Provide step-by-step explanations for complex topics",
    ],
    tone: "detailed",
    outputFormat: "text",
  },
  {
    id: "customer-support",
    label: "Customer Support Agent",
    category: "conversation",
    role: "a friendly and efficient customer support representative",
    context: "You are handling customer inquiries for a SaaS product.",
    task: "Help the customer resolve their issue or answer their question. Be empathetic, provide clear solutions, and escalate when needed.",
    constraints: [
      "Always acknowledge the customer's concern first",
      "Provide step-by-step solutions when applicable",
      "Offer to follow up if the issue is not resolved",
    ],
    tone: "casual",
    outputFormat: "text",
  },
];
