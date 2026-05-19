export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  if (forwardedFor) return forwardedFor

  const realIp = req.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp

  return 'unknown'
}
