import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config({ path: ".env" })

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Create a .env file (see .env.example) before running Drizzle commands."
  )
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
  verbose: true,
  strict: true,
})
