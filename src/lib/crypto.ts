import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const MIN_KEY_LENGTH = 32

function assertStrongProductionKey(key: string): void {
  if (process.env.NODE_ENV !== 'production') return

  const normalized = key.toLowerCase()
  const uniqueChars = new Set(key).size
  const isPlaceholder =
    normalized.includes('change-me') ||
    normalized.includes('placeholder') ||
    normalized.includes('example') ||
    normalized.includes('development') ||
    normalized.includes('test') ||
    normalized.includes('secret') ||
    normalized.includes('password')
  const isRepeated = /^(.)(\1)+$/.test(key)

  if (uniqueChars < 16 || isPlaceholder || isRepeated) {
    throw new Error('ENCRYPTION_KEY must be a strong production secret')
  }
}

function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY
  if (!key || key.length < MIN_KEY_LENGTH) {
    throw new Error('ENCRYPTION_KEY must be at least 32 characters')
  }
  assertStrongProductionKey(key)
  return Buffer.from(key.slice(0, 32), 'utf-8')
}

export function encrypt(text: string): string {
  const key = getEncryptionKey()
  const iv = randomBytes(12)
  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf-8'),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag()
  return [
    iv.toString('hex'),
    tag.toString('hex'),
    encrypted.toString('hex'),
  ].join(':')
}

export function decrypt(payload: string): string {
  const key = getEncryptionKey()
  const [ivHex, tagHex, encHex] = payload.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const tag = Buffer.from(tagHex, 'hex')
  const encrypted = Buffer.from(encHex, 'hex')
  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
    'utf-8',
  )
}
