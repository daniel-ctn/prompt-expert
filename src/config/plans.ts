export type PlanId = "free" | "pro";

export type CreditOperation = "optimize" | "test" | "analyze";

export interface PlanDefinition {
  name: string;
  credits: number;
  price: number;
  features: string[];
}

export const PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    name: "Free",
    credits: 50,
    price: 0,
    features: [
      "50 AI credits per month",
      "Prompt builder & templates",
      "Save up to 10 prompts",
      "Public gallery access",
      "Community sharing",
    ],
  },
  pro: {
    name: "Pro",
    credits: 1000,
    price: 15,
    features: [
      "1,000 AI credits per month",
      "Prompt builder & templates",
      "Unlimited saved prompts",
      "Public gallery access",
      "Community sharing",
      "Buy additional credit packs",
      "Priority support",
      "REST API access",
    ],
  },
} as const;

export const CREDIT_COSTS: Record<CreditOperation, number> = {
  optimize: 1,
  test: 1,
  analyze: 1,
};

export const CREDIT_PACK = {
  credits: 200,
  price: 5,
} as const;
