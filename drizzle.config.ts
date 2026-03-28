import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'drizzle-kit'

for (const envFile of ['.env.local', '.env']) {
  const envPath = resolve(process.cwd(), envFile)

  if (existsSync(envPath)) {
    process.loadEnvFile(envPath)
  }
}

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
