const SECRET_PATTERN =
  /(sk-[\w-]+|sk-ant-[\w-]+|AIza[\w-]+|Bearer\s+[\w.-]+|pe_[a-f0-9]+)/gi

export function redactSecrets(value: string): string {
  return value.replace(SECRET_PATTERN, '[REDACTED]')
}

export function logAiRequest(data: {
  userId: string
  endpoint: 'analyze' | 'optimize' | 'test'
  model: string
  provider: string
  hosted: boolean
  promptLength: number
  status: 'accepted' | 'rejected'
  reason?: string
}) {
  console.info(
    JSON.stringify({
      event: 'ai_request',
      userId: data.userId,
      endpoint: data.endpoint,
      model: data.model,
      provider: data.provider,
      hosted: data.hosted,
      promptLength: data.promptLength,
      status: data.status,
      reason: data.reason ? redactSecrets(data.reason) : undefined,
    }),
  )
}
