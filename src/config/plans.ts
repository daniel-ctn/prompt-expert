export type PlanId = 'free' | 'pro'

export type CreditOperation = 'optimize' | 'test' | 'analyze'

export interface PlanDefinition {
  name: string
  description: string
  credits: number
  features: string[]
}

export const PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    name: 'Community',
    description: 'The default hosted allowance for free community use.',
    credits: 50,
    features: [
      '50 hosted AI credits per month',
      'Prompt builder & templates',
      'Save up to 10 prompts',
      'Public gallery access',
      'Community sharing',
      'Bring your own provider keys for heavier use',
    ],
  },
  pro: {
    name: 'Extended community',
    description: 'A non-paid higher hosted allowance for launch pilots.',
    credits: 1000,
    features: [
      '1,000 hosted AI credits per month',
      'Prompt builder & templates',
      'Unlimited saved prompts',
      'Public gallery access',
      'Community sharing',
      'Bring your own provider keys for heavier use',
      'REST API access',
    ],
  },
} as const

export const HOSTED_AI_LIMITS = {
  monthlyCredits: PLANS.free.credits,
  perMinuteRequests: 20,
  maxRequestBodyBytes: 32_000,
  maxPromptInputLength: 10_000,
  maxOutputTokens: {
    optimize: 1200,
    test: 1600,
    analyze: 900,
  },
} as const

export const CREDIT_COSTS: Record<CreditOperation, number> = {
  optimize: 1,
  test: 1,
  analyze: 1,
}
