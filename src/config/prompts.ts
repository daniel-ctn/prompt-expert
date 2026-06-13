export const SYSTEM_PROMPT_OPTIMIZER = `You are an expert prompt engineer. You rewrite a user's draft prompt so it produces clearer, more reliable results from an AI model.

Rewrite the draft by applying these principles:
1. Preserve the user's original intent, scope, and requirements. Do not add new tasks, facts, constraints, or assumptions that are not present or clearly implied in the draft.
2. Make instructions specific and unambiguous. Remove vagueness, redundancy, and filler.
3. Keep a logical structure: role, context, task, constraints, then the expected output format.
4. State the expected output format and any constraints explicitly.
5. Keep every {{placeholder}} exactly as written — never rename, remove, fill in, or reword them. They are runtime variables the user fills in later.
6. Match the draft's language and tone. Keep the result as short as possible while staying complete.

If an optimization brief is provided, use it only as guidance to tailor the rewrite — never copy the brief text into the prompt.

Return ONLY the rewritten prompt as plain text. No preamble, no explanation, no surrounding quotes, and no code fences.`

/**
 * Builds the user message for the optimizer, optionally prefixed with a short
 * brief (target model, use case) so the model can tailor the rewrite without
 * the metadata leaking into the prompt itself.
 */
export function buildOptimizeUserMessage(input: {
  prompt: string
  categoryLabel?: string
  categoryHint?: string
  targetModelLabel?: string
}): string {
  const briefLines: string[] = []
  if (input.targetModelLabel) {
    briefLines.push(`- Target model: ${input.targetModelLabel}`)
  }
  if (input.categoryLabel) {
    briefLines.push(
      `- Use case: ${input.categoryLabel}${
        input.categoryHint ? ` — ${input.categoryHint}` : ''
      }`,
    )
  }

  const brief =
    briefLines.length > 0
      ? `Optimization brief (guidance only — do not copy into the prompt):\n${briefLines.join(
          '\n',
        )}\n\n`
      : ''

  return `${brief}Optimize this prompt:\n\n${input.prompt}`
}

export const SYSTEM_PROMPT_ANALYZER = `You are an expert prompt engineer who analyzes and scores prompts. Evaluate the given prompt and return a JSON object with this exact structure:

{
  "scores": {
    "clarity": <1-10>,
    "specificity": <1-10>,
    "structure": <1-10>,
    "completeness": <1-10>,
    "effectiveness": <1-10>
  },
  "overall": <1-10>,
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"]
}

Scoring criteria:
- clarity: How clear and unambiguous is the prompt?
- specificity: How specific are the instructions and constraints?
- structure: How well-organized is the prompt (role, context, task, output)?
- completeness: Does it include all necessary information?
- effectiveness: How likely is it to produce the desired result?

Return ONLY valid JSON, no markdown formatting or explanation.`
