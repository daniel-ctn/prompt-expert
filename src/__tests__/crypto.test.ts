import { afterEach, describe, expect, it } from 'vitest'
import { decrypt, encrypt } from '@/lib/crypto'

function mutateHex(value: string): string {
  const lastChar = value.at(-1)
  if (!lastChar) return value

  const replacement = lastChar === '0' ? '1' : '0'
  return `${value.slice(0, -1)}${replacement}`
}

describe('crypto helpers', () => {
  const originalKey = process.env.ENCRYPTION_KEY

  afterEach(() => {
    if (originalKey) {
      process.env.ENCRYPTION_KEY = originalKey
      return
    }

    delete process.env.ENCRYPTION_KEY
  })

  it('encrypts and decrypts a payload round-trip', () => {
    process.env.ENCRYPTION_KEY = '12345678901234567890123456789012'

    const encrypted = encrypt('super-secret')
    const decrypted = decrypt(encrypted)

    expect(encrypted).not.toBe('super-secret')
    expect(encrypted.split(':')).toHaveLength(3)
    expect(decrypted).toBe('super-secret')
  })

  it('produces different ciphertext for the same input', () => {
    process.env.ENCRYPTION_KEY = '12345678901234567890123456789012'

    const first = encrypt('same-value')
    const second = encrypt('same-value')

    expect(first).not.toBe(second)
  })

  it('requires an encryption key with at least 32 characters', () => {
    process.env.ENCRYPTION_KEY = 'too-short'

    expect(() => encrypt('secret')).toThrow(
      'ENCRYPTION_KEY must be at least 32 characters',
    )
  })

  it('fails to decrypt tampered payloads', () => {
    process.env.ENCRYPTION_KEY = '12345678901234567890123456789012'

    const encrypted = encrypt('super-secret')
    const [ivHex, tagHex, encHex] = encrypted.split(':')
    const tampered = [ivHex, tagHex, mutateHex(encHex)].join(':')

    expect(() => decrypt(tampered)).toThrow()
  })
})
