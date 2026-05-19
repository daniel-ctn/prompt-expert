export async function readJsonBodyWithLimit(
  req: Request,
  maxBytes: number,
): Promise<{ ok: true; data: unknown } | { ok: false; response: Response }> {
  const contentLength = Number(req.headers.get('content-length') ?? 0)
  if (contentLength > maxBytes) {
    return {
      ok: false,
      response: Response.json(
        { error: 'Request body is too large' },
        { status: 413 },
      ),
    }
  }

  const body = await req.text()
  if (new TextEncoder().encode(body).length > maxBytes) {
    return {
      ok: false,
      response: Response.json(
        { error: 'Request body is too large' },
        { status: 413 },
      ),
    }
  }

  try {
    return { ok: true, data: JSON.parse(body) }
  } catch {
    return {
      ok: false,
      response: Response.json({ error: 'Invalid JSON body' }, { status: 400 }),
    }
  }
}
